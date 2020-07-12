import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Input, makeStyles, Button, Grid, Dialog, DialogContent, DialogTitle, DialogActions } from '@material-ui/core';
import { RHFInput } from 'react-hook-form-input';
import { useForm } from 'react-hook-form';
import UPDATE_RESTAURANT_DETAILS from '../../graphql/mutations/UPDATE_RESTAURANT_DETAILS';

const useStyles = makeStyles((theme) => ({
	formInput: {
		width: '100%'
	}
}));

const formatLabel = (s) => s.split('_').map((v) => v.substring(0, 1).toUpperCase() + v.substring(1)).join(' ');

const RestaurantModal = ({ restaurant, role, refetch }) => {
	const [ open, setOpen ] = useState(false);
	const [ updateRestaurant ] = useMutation(UPDATE_RESTAURANT_DETAILS);
	const classes = useStyles();
	const { register, handleSubmit, setValue, reset } = useForm({
		defaultValues: {
			name: restaurant.name,
			phone_number: restaurant.phone_number,
			address: restaurant.address
		}
	});

	useEffect(
		() => {
			reset(restaurant);
		},
		[ restaurant ]
	);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleSave = async (data) => {
		try {
			await updateRestaurant({ variables: { ...data, id: restaurant.id } });
			handleClose();
			await refetch();
			alert(`You've successfully edited ${data.name}`);
		} catch (err) {
			alert(err.message);
		}
	};

	return (
		<React.Fragment>
			<Button color="primary" size="small" onClick={handleOpen}>
				{`${role === 'restaurant_manager' ? 'Edit' : 'View'} the restaurant`}
			</Button>
			<Dialog open={open} onClose={handleClose}>
				<form className={classes.modalBody} onSubmit={handleSubmit(handleSave)}>
					<DialogTitle>{`${role === 'restaurant_manager' ? 'Edit' : 'View'} the restaurant`}</DialogTitle>
					<DialogContent>
						<Grid container spacing={2}>
							{[ 'name', 'phone_number', 'address' ].map((value) => {
								return (
									<React.Fragment key={value}>
										<Grid item xs={4}>
											<label>{formatLabel(value) + ':'}</label>
										</Grid>
										<Grid item xs={8}>
											<RHFInput
												as={<Input />}
												register={register}
												setValue={setValue}
												name={value}
												disabled={role !== 'restaurant_manager'}
												className={classes.formInput}
											/>
										</Grid>
									</React.Fragment>
								);
							})}
						</Grid>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose} color="primary">
							Cancel
						</Button>
						{role === 'restaurant_manager' && (
							<Button type="submit" variant="contained" color="primary" autoFocus>
								Save
							</Button>
						)}
					</DialogActions>
				</form>
			</Dialog>
		</React.Fragment>
	);
};

export default RestaurantModal;
