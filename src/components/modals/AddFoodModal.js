import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, makeStyles, Grid, Input, Button } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { RHFInput } from 'react-hook-form-input';
import { useMutation } from '@apollo/react-hooks';
import INSERT_FOOD from '../../graphql/mutations/INSERT_FOOD';

const useStyles = makeStyles((theme) => ({
	content: {
		display: 'flex',
		flexDirection: 'column'
	},
	formItem: {
		marginBottom: theme.spacing(1)
	}
}));

const AddFoodModal = ({ restaurant_id, refetch, ...props }) => {
	const [ open, setOpen ] = useState(false);
	const [ insertFood ] = useMutation(INSERT_FOOD);
	const { register, handleSubmit, setValue } = useForm({
		defaultValues: {
			price: '0'
		}
	});
	const classes = useStyles();

	const handleOpen = () => {
		setOpen(true);
	};

	const handleCancel = () => {
		setOpen(false);
	};

	const handleAddFood = async (data) => {
		try {
			await insertFood({ variables: { ...data, restaurant_id } });
			handleCancel();
			await refetch();
			alert('You have succefully added ' + data.name);
		} catch (err) {
			alert(err.message);
		}
	};
	return (
		<React.Fragment>
			<Button onClick={handleOpen} {...props}>
				Add Food
			</Button>
			<Dialog open={open} onClose={handleCancel}>
				<form onSubmit={handleSubmit(handleAddFood)}>
					<DialogTitle>Add Food</DialogTitle>
					<DialogContent className={classes.content}>
						<Grid container spacing={2}>
							<Grid item xs={3}>
								<label>Name:</label>
							</Grid>
							<Grid item xs={9}>
								<RHFInput
									as={<Input />}
									register={register({ required: true })}
									setValue={setValue}
									name="name"
								/>
							</Grid>
							<Grid item xs={3}>
								<label>Price:</label>
							</Grid>
							<Grid item xs={9}>
								<RHFInput
									as={<Input type="number" />}
									type="number"
									register={register({ min: 0 })}
									setValue={setValue}
									name="price"
								/>
							</Grid>
						</Grid>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleCancel} color="primary">
							Cancel
						</Button>
						<Button type="submit" variant="contained" color="primary" autoFocus>
							Save
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		</React.Fragment>
	);
};

export default AddFoodModal;
