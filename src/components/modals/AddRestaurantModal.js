import React, { useState } from 'react';
import { Dialog, Button, DialogActions, DialogContent, DialogTitle, TextField, makeStyles } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { RHFInput } from 'react-hook-form-input';
import { useMutation } from '@apollo/react-hooks';
import INSERT_RESTAURANT from '../../graphql/mutations/INSERT_RESTAURANT';

const useStyles = makeStyles((theme) => ({
	content: {
		display: 'flex',
		flexDirection: 'column'
	},
	formItem: {
		marginBottom: theme.spacing(1)
	}
}));

const AddRestaurantModal = ({ refetch }) => {
	const [ open, setOpen ] = useState(false);
	const [ insertRestaurant ] = useMutation(INSERT_RESTAURANT);
	const { register, handleSubmit, setValue } = useForm();
	const classes = useStyles();

	const handleOpen = () => {
		setOpen(true);
	};

	const handleCancel = () => {
		setOpen(false);
	};

	const handleAddRestaurant = async (data) => {
		try {
			await insertRestaurant({ variables: data });
			handleCancel();
			await refetch();
			alert(`You've successfully added ${data.name}`);
		} catch (err) {
			alert(err.message);
		}
	};

	return (
		<React.Fragment>
			<Button variant="outlined" color="primary" onClick={handleOpen}>
				Add Restaurant
			</Button>
			<Dialog open={open} onClose={handleCancel}>
				<form onSubmit={handleSubmit(handleAddRestaurant)}>
					<DialogTitle>Add Restaurant</DialogTitle>
					<DialogContent className={classes.content}>
						<RHFInput
							as={<TextField />}
							register={register({ required: true })}
							setValue={setValue}
							name="name"
							label="Name"
							className={classes.formItem}
						/>
						<RHFInput
							as={<TextField />}
							register={register}
							setValue={setValue}
							name="phone_number"
							label="Phone Number"
							className={classes.formItem}
						/>
						<RHFInput
							as={<TextField />}
							register={register}
							setValue={setValue}
							name="address"
							label="Address"
							className={classes.formItem}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleCancel} color="primary">
							Cancel
						</Button>
						<Button type="submit" color="primary" autoFocus>
							Save
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		</React.Fragment>
	);
};

export default AddRestaurantModal;
