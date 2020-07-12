import React from 'react';
import {
	Accordion,
	AccordionSummary,
	Typography,
	makeStyles,
	AccordionDetails,
	Chip,
	TableBody,
	TableHead,
	Table,
	TableContainer,
	TableCell,
	TableRow,
	Paper,
	Button
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DoneIcon from '@material-ui/icons/Done';
import { useQuery, useMutation } from '@apollo/react-hooks';
import WithProtectedPage from '../hoc/WithProtectedPage';
import UPDATE_ORDER_STATUS from '../graphql/mutations/UPDATE_ORDER_STATUS';
import GET_ORDERS from '../graphql/queries/GET_ORDERS';

import { useRoleContext } from '../context/RoleContext';
import UPDATE_ORDER_DRIVER from '../graphql/mutations/UDPATE_ORDER_DRIVER';

const actions = {
	customer: {
		checkable: new Set([ 'driver_arrived' ]),
		next: {
			driver_arrived: 'completed'
		}
	},
	driver: {
		checkable: new Set([ 'delivering' ]),
		next: {
			delivering: 'driver_arrived'
		}
	},
	restaurant_manager: {
		checkable: new Set([ 'confirming_order', 'preparing_food' ]),
		next: {
			confirming_order: 'preparing_food',
			preparing_food: 'delivering'
		}
	}
};

const formatDate = (timestamp) => {
	const date = new Date(timestamp);
	return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

const useStyles = makeStyles((theme) => ({
	heading: {
		fontSize: theme.typography.pxToRem(15),
		fontWeight: theme.typography.fontWeightRegular
	},
	secondary: {
		color: theme.palette.text.secondary
	},
	accordionDetails: {
		display: 'block'
	},
	ml: {
		marginLeft: theme.spacing(1)
	},
	tableContainer: {
		marginTop: theme.spacing(1)
	},
	flexJustifyBetween: {
		width: '100%',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	title: {
		marginBottom: theme.spacing(2)
	},
	part: {
		marginBottom: theme.spacing(2)
	}
}));

const Order = () => {
	const { loading, error, data, refetch } = useQuery(GET_ORDERS);
	const [ updateOrderStatus ] = useMutation(UPDATE_ORDER_STATUS);
	const [ updateOrderDriver ] = useMutation(UPDATE_ORDER_DRIVER);
	const { currentRole } = useRoleContext();
	const classes = useStyles();

	const ordersWithDriver = () => {
		if (data.order && currentRole === 'driver') return data.order.filter((order) => !!order.driver_id);
		return data.order;
	};

	const handleCompleteDelivering = (order) => {
		return async (e) => {
			try {
				await updateOrderStatus({
					variables: { id: order.id, status: actions[currentRole].next[order.status] }
				});
				await refetch();
				alert(`You've successfully udpated the order status`);
			} catch (err) {
				alert(err.message);
			}
		};
	};

	const handleReceive = (orderId) => {
		return async (e) => {
			try {
				await updateOrderDriver({ variables: { id: orderId } });
				await refetch();
				alert(`You become the driver of order ${orderId}`);
			} catch (err) {
				alert(err.message);
			}
		};
	};

	if (loading) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <p>{error.message}</p>;
	}

	if (data.order.length === 0) {
		return <p>No orders available</p>;
	}

	// orders to receive if driver_id == null
	const orderToReceive = currentRole === 'driver' && (
		<div className={classes.part}>
			<Typography variant="h5" className={classes.title}>
				Orders to receive
			</Typography>
			{data.order.filter((order) => !order.driver_id).map((order) => {
				return (
					<Accordion key={order.id}>
						<AccordionSummary expandIcon={<ExpandMoreIcon />}>
							<div className={classes.flexJustifyBetween}>
								<div style={{ width: '100%', display: 'flex' }}>
									<Typography className={classes.heading}>{`Order: ${order.id}`}</Typography>
									<Chip
										className={classes.ml}
										label={order.status.replace('_', ' ')}
										variant={order.status !== 'completed' ? 'outlined' : 'default'}
										color="primary"
										size="small"
										clickable={actions[currentRole].checkable.has(order.status)}
										onDelete={
											actions[currentRole].checkable.has(order.status) ? (
												handleCompleteDelivering(order)
											) : null
										}
										deleteIcon={
											actions[currentRole].checkable.has(order.status) ? <DoneIcon /> : null
										}
									/>
								</div>
								<div>
									<Button variant="contained" color="primary" onClick={handleReceive(order.id)}>
										Receive
									</Button>
								</div>
							</div>
						</AccordionSummary>
						<AccordionDetails className={classes.accordionDetails}>
							<div>
								<Typography variant="caption" className={classes.secondary}>
									{`created at: ${formatDate(order.created_at)}`}
								</Typography>
							</div>
							<div>
								<Typography variant="caption" className={classes.secondary}>
									{`restaurant: ${order.restaurant.name}`}
								</Typography>
							</div>
							<TableContainer component={Paper} className={classes.tableContainer}>
								<Table>
									<TableHead>
										<TableRow>
											<TableCell>No.</TableCell>
											<TableCell>Name</TableCell>
											<TableCell>Price</TableCell>
											<TableCell>Quantity</TableCell>
											<TableCell>Total</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{order.order_items.map((item, i) => {
											return (
												<TableRow key={i}>
													<TableCell>{i + 1}</TableCell>
													<TableCell>{item.food.name}</TableCell>
													<TableCell>{item.price}</TableCell>
													<TableCell>{item.quantity}</TableCell>
													<TableCell>{(item.price * item.quantity).toFixed(2)}</TableCell>
												</TableRow>
											);
										})}
										<TableRow>
											<TableCell>Total</TableCell>
											{Array.from({ length: 3 }).map((v, i) => <TableCell key={i} />)}
											<TableCell>
												{order.order_items
													.reduce((acc, currentItem) => {
														return acc + currentItem.price * currentItem.quantity;
													}, 0)
													.toFixed(2)}
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</TableContainer>
						</AccordionDetails>
					</Accordion>
				);
			})}
		</div>
	);

	return (
		<div>
			{orderToReceive}
			<Typography variant="h5" className={classes.title}>
				All orders
			</Typography>
			{ordersWithDriver().map((order) => {
				return (
					<Accordion key={order.id}>
						<AccordionSummary expandIcon={<ExpandMoreIcon />}>
							<Typography className={classes.heading}>{`Order: ${order.id}`}</Typography>
							<Chip
								className={classes.ml}
								label={order.status.replace('_', ' ')}
								variant={order.status !== 'completed' ? 'outlined' : 'default'}
								color="primary"
								size="small"
								clickable={actions[currentRole].checkable.has(order.status)}
								onDelete={
									actions[currentRole].checkable.has(order.status) ? (
										handleCompleteDelivering(order)
									) : null
								}
								deleteIcon={actions[currentRole].checkable.has(order.status) ? <DoneIcon /> : null}
							/>
							<Chip
								className={classes.ml}
								label={`delivered by: ${order.driver_id ? order.driver_id : 'none'}`}
								variant={order.status !== 'completed' ? 'outlined' : 'default'}
								color="secondary"
								size="small"
							/>
						</AccordionSummary>
						<AccordionDetails className={classes.accordionDetails}>
							<div>
								<Typography variant="caption" className={classes.secondary}>
									{`created at: ${formatDate(order.created_at)}`}
								</Typography>
							</div>
							<div>
								<Typography variant="caption" className={classes.secondary}>
									{`restaurant: ${order.restaurant.name}`}
								</Typography>
							</div>
							<TableContainer component={Paper} className={classes.tableContainer}>
								<Table>
									<TableHead>
										<TableRow>
											<TableCell>No.</TableCell>
											<TableCell>Name</TableCell>
											<TableCell>Price</TableCell>
											<TableCell>Quantity</TableCell>
											<TableCell>Total</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{order.order_items.map((item, i) => {
											return (
												<TableRow key={i}>
													<TableCell>{i + 1}</TableCell>
													<TableCell>{item.food.name}</TableCell>
													<TableCell>{item.price}</TableCell>
													<TableCell>{item.quantity}</TableCell>
													<TableCell>{(item.price * item.quantity).toFixed(2)}</TableCell>
												</TableRow>
											);
										})}
										<TableRow>
											<TableCell>Total</TableCell>
											{Array.from({ length: 3 }).map((v, i) => <TableCell key={i} />)}
											<TableCell>
												{order.order_items
													.reduce((acc, currentItem) => {
														return acc + currentItem.price * currentItem.quantity;
													}, 0)
													.toFixed(2)}
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</TableContainer>
						</AccordionDetails>
					</Accordion>
				);
			})}
		</div>
	);
};

export default WithProtectedPage(Order);
