import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import {
	List,
	ListItem,
	ListItemText,
	makeStyles,
	Typography,
	Checkbox,
	ListItemIcon,
	ListItemSecondaryAction
} from '@material-ui/core';

import AddRestaurantModal from '../components/modals/AddRestaurantModal';
import AddFoodModal from '../components/modals/AddFoodModal';
import RestaurantModal from '../components/modals/RestaurantModal';
import EditFoodModal from '../components/modals/EditFoodModal';
import { useCartContext } from '../context/CartContext';
import { useRoleContext } from '../context/RoleContext';
import WithProtectedPage from '../hoc/WithProtectedPage';
import GET_RESTAURANT_FOOD from '../graphql/queries/GET_RESTAURANT_FOOD';

const useStyles = makeStyles((theme) => ({
	list: {
		width: '100%',
		backgroundColor: theme.palette.background.paper,
		marginBottom: theme.spacing(2)
	},
	listTitle: {},
	listTitleBar: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1)
	},
	secondary: {
		color: theme.palette.text.secondary
	},
	addFoodBtn: {
		marginBottom: theme.spacing(2)
	}
}));

const Home = () => {
	const { loading, error, data, refetch } = useQuery(GET_RESTAURANT_FOOD);

	const { updateCart, hasItem, removeItem } = useCartContext();
	const { currentRole } = useRoleContext();
	const classes = useStyles();

	const handleListItem = (restaurant, food) => {
		if (currentRole === 'restaurant_manager') return () => {};
		return (e) => {
			if (hasItem(restaurant.id, food.id)) {
				removeItem(restaurant.id, food.id);
			} else {
				updateCart(restaurant, food, 1);
			}
		};
	};

	if (loading) {
		return <p>Loading...</p>;
	}
	if (error) {
		return <p>Error</p>;
	}

	if (data.length === 0) {
		return <p>Currently unavailable for order</p>;
	}

	if (currentRole === 'driver') {
		return <p>For driver, please directly go to order page</p>;
	}

	return (
		<div>
			{currentRole === 'restaurant_manager' && <AddRestaurantModal refetch={refetch} />}
			{data.restaurant.map((restaurant) => {
				return (
					<React.Fragment key={restaurant.id}>
						<div className={classes.listTitleBar}>
							<Typography variant="h6" className={classes.listTitle}>
								{restaurant.name}
							</Typography>
							<RestaurantModal restaurant={restaurant} role={currentRole} refetch={refetch} />
						</div>
						<List component="nav" key={restaurant.id} className={classes.list}>
							{restaurant.food.map((food) => {
								return (
									<ListItem dense button key={food.id} onClick={handleListItem(restaurant, food)}>
										{currentRole !== 'restaurant_manager' && (
											<ListItemIcon>
												<Checkbox
													edge="start"
													checked={hasItem(restaurant.id, food.id)}
													tabIndex={-1}
													disableRipple
													color="primary"
												/>
											</ListItemIcon>
										)}
										<ListItemText
											primary={
												<p>
													<span style={{ marginRight: 6 }}>{food.name}</span>
													<span className={classes.secondary}>{`$${food.price}`}</span>
												</p>
											}
										/>
										{currentRole === 'restaurant_manager' && (
											<ListItemSecondaryAction>
												<EditFoodModal food={food} refetch={refetch} />
											</ListItemSecondaryAction>
										)}
									</ListItem>
								);
							})}
						</List>
						{currentRole === 'restaurant_manager' && (
							<AddFoodModal
								variant="contained"
								color="primary"
								className={classes.addFoodBtn}
								restaurant_id={restaurant.id}
								refetch={refetch}
							/>
						)}
					</React.Fragment>
				);
			})}
		</div>
	);
};

export default WithProtectedPage(Home);
