import React, { useState } from 'react';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import DeleteIcon from '@material-ui/icons/Delete';
import {
	Dialog,
	DialogActions,
	DialogTitle,
	DialogContent,
	IconButton,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
	makeStyles
} from '@material-ui/core';

import { useCartContext } from '../../context/CartContext';
import CheckoutButton from '../CheckoutButton';

const useStyles = makeStyles((theme) => ({
	itemList: {
		marginBottom: theme.spacing(2)
	},
	itemTitleBar: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center'
	}
}));

const CartModal = () => {
	const [ open, setOpen ] = useState(false);
	const { getItems, removeItem, updateCart, removeRestaurant } = useCartContext();
	const classes = useStyles();

	const items = getItems();

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleRemoveRestaurant = (restaurantId) => {
		return (e) => {
			removeRestaurant(restaurantId);
		};
	};

	const handleMinusItem = (restaurant, food, quantity) => {
		return (e) => {
			if (quantity - 1 <= 0) {
				removeItem(restaurant.id, food.id);
			} else {
				updateCart(restaurant, food, quantity - 1);
			}
		};
	};

	const handleAddItem = (restaurant, food, quantity) => {
		return (e) => {
			if (quantity + 1 > 0) {
				updateCart(restaurant, food, quantity + 1);
			}
		};
	};

	return (
		<React.Fragment>
			<IconButton children={<ShoppingCartIcon />} onClick={handleOpen} />
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Cart</DialogTitle>
				<DialogContent>
					{items.length === 0 && <Typography>Please add items for the checkout</Typography>}
					{items.map(({ restaurant, items }) => {
						return (
							<div key={restaurant.id} className={classes.itemList}>
								<div className={classes.itemTitleBar}>
									<Typography variant="body1">{restaurant.name}</Typography>
									<IconButton
										children={<DeleteIcon />}
										onClick={handleRemoveRestaurant(restaurant.id)}
									/>
								</div>
								<TableContainer component={Paper}>
									<Table>
										<TableHead color="primary">
											<TableRow>
												{[ 'No', 'Name', 'Price', 'Quantity' ].map((col) => {
													return <TableCell key={col}>{col}</TableCell>;
												})}
											</TableRow>
										</TableHead>
										<TableBody>
											{items.map((item, i) => {
												return (
													<TableRow key={item.id}>
														<TableCell>{i + 1}</TableCell>
														<TableCell>{item.name}</TableCell>
														<TableCell>{item.price}</TableCell>
														<TableCell>
															<IconButton
																size="small"
																children={<RemoveIcon />}
																onClick={handleMinusItem(
																	restaurant,
																	item,
																	item.quantity
																)}
															/>
															{item.quantity}
															<IconButton
																size="small"
																children={<AddIcon />}
																onClick={handleAddItem(restaurant, item, item.quantity)}
															/>
														</TableCell>
													</TableRow>
												);
											})}
										</TableBody>
									</Table>
								</TableContainer>
							</div>
						);
					})}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Cancel
					</Button>
					<CheckoutButton autoFocus />
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
};

export default CartModal;
