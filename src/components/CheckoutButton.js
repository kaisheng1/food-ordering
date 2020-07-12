import React from 'react';
import Button from '@material-ui/core/Button';

import { useCartContext } from '../context/CartContext';

const CheckoutButton = (props) => {
	const { getItems, checkout } = useCartContext();
	const handleCheckout = async () => {
		try {
			await checkout();
			alert("You've successfully checked out");
		} catch (err) {
			alert('Failed to check out');
		}
	};
	return (
		<Button
			variant="contained"
			color="primary"
			size="small"
			onClick={handleCheckout}
			disabled={getItems().length === 0}
			{...props}
		>
			Checkout
		</Button>
	);
};

export default CheckoutButton;
