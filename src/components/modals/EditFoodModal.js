import React, { useState, useEffect } from 'react';
import { useMutation, resetApolloContext } from '@apollo/react-hooks';
import {
	Dialog,
	IconButton,
	DialogActions,
	DialogContent,
	DialogTitle,
	makeStyles,
	Grid,
	Input,
	Button
} from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import { useForm } from 'react-hook-form';
import { RHFInput } from 'react-hook-form-input';
import UPDATE_FOOD from '../../graphql/mutations/UPDATE_FOOD';

const useStyles = makeStyles((theme) => ({
	content: {
		display: 'flex',
		flexDirection: 'column'
	},
	formItem: {
		marginBottom: theme.spacing(1)
	}
}));

const EditFoodModal = ({ food, refetch }) => {
	const [ open, setOpen ] = useState(false);
	const [ updateFood ] = useMutation(UPDATE_FOOD);
	const { register, handleSubmit, setValue, reset } = useForm({
		defaultValues: {
			name: food.name,
			price: JSON.stringify(food.price)
		}
	});
	const classes = useStyles();

	useEffect(
		() => {
			reset(food);
		},
		[ food ]
	);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleCancel = () => {
		setOpen(false);
	};

	const handleEditFood = async (data) => {
		try {
			await updateFood({ variables: { ...data, id: food.id } });
			handleCancel();
			await refetch();
			alert(`You've successfully edited ${data.name}`);
		} catch (err) {
			alert(err.message);
		}
	};
	return (
		<React.Fragment>
			<IconButton onClick={handleOpen}>
				<CreateIcon />
			</IconButton>
			<Dialog open={open} onClose={handleCancel}>
				<form onSubmit={handleSubmit(handleEditFood)}>
					<DialogTitle>Edit Food</DialogTitle>
					<DialogContent className={classes.content}>
						<Grid container spacing={2}>
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

export default EditFoodModal;
