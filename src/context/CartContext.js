import React, { createContext, useContext, useReducer } from 'react';
import { useMutation } from '@apollo/react-hooks';

import INSERT_ORDER from '../graphql/mutations/INSERT_ORDER';
import INSERT_ORDER_ITEMS from '../graphql/mutations/INSERT_ORDER_ITEMS';

const UPDATE_CART = 'UPDATE_CART';
const REMOVE_ITEM = 'REMOVE_ITEM';
const REMOVE_RESTAURANT = 'REMOVE_RESTAURANT';
const RESET = 'RESET';

const INITIAL_STATE = {
	restaurants: {},
	items: {}
};

const cartReducer = (state, action) => {
	switch (action.type) {
		case UPDATE_CART:
			const { restaurant, food, quantity } = action.payload;

			return {
				restaurants: {
					...state.restaurants,
					[restaurant.id]: restaurant.name
				},
				items: {
					...state.items,
					[restaurant.id]: {
						...state.items[restaurant.id],
						[food.id]: {
							id: food.id,
							name: food.name,
							price: food.price,
							quantity
						}
					}
				}
			};
		case REMOVE_ITEM:
			const { restaurantId, foodId } = action.payload;

			return {
				restaurants: state.restaurants,
				items: Object.keys(state.items).reduce((acc, restaurantKey) => {
					if (restaurantKey != restaurantId) return { ...acc, [restaurantKey]: state.items[restaurantKey] };

					return {
						...acc,
						[restaurantKey]: Object.keys(state.items[restaurantKey]).filter((key) => key != foodId).reduce(
							(acc, key) => ({
								...acc,
								[key]: state.items[restaurantKey][key]
							}),
							{}
						)
					};
				}, {})
			};

		case REMOVE_RESTAURANT:
			return {
				restaurants: Object.keys(state.restaurants).reduce((acc, restaurantKey) => {
					if (restaurantKey != action.payload.restaurantId)
						return { ...acc, [restaurantKey]: state.restaurants[restaurantKey] };
					return acc;
				}, {}),
				items: Object.keys(state.items).reduce((acc, restaurantKey) => {
					if (restaurantKey != action.payload.restaurantId)
						return { ...acc, [restaurantKey]: state.items[restaurantKey] };
					return acc;
				}, {})
			};
		case RESET:
			return INITIAL_STATE;
		default:
			return state;
	}
};

export const CartContext = createContext();
export const useCartContext = () => useContext(CartContext);

export const CartContextProvider = ({ children }) => {
	const [ state, dispatch ] = useReducer(cartReducer, INITIAL_STATE);
	const [ insertOrder ] = useMutation(INSERT_ORDER);
	const [ insertOrderItems ] = useMutation(INSERT_ORDER_ITEMS);

	const hasItem = (restaurantId, foodId) => {
		return !!state.items[restaurantId] && !!state.items[restaurantId][foodId];
	};

	const getItems = () => {
		return Object.keys(state.restaurants).map((restaurantId) => ({
			restaurant: { id: restaurantId, name: state.restaurants[restaurantId] },
			items: [ ...Object.values(state.items[restaurantId] ? state.items[restaurantId] : {}) ]
		}));
	};

	const updateCart = (restaurant, food, quantity) => {
		dispatch({ type: UPDATE_CART, payload: { restaurant, food, quantity } });
	};

	const removeItem = (restaurantId, foodId) => {
		if (
			state.items[restaurantId] &&
			state.items[restaurantId][foodId] &&
			Object.keys(state.items[restaurantId]).length === 1
		) {
			removeRestaurant(restaurantId);
		} else {
			dispatch({ type: REMOVE_ITEM, payload: { restaurantId, foodId } });
		}
	};

	const removeRestaurant = (restaurantId) => {
		dispatch({ type: REMOVE_RESTAURANT, payload: { restaurantId } });
	};

	const checkout = async () => {
		for (const restaurant_id of Object.keys(state.items)) {
			try {
				const data = await insertOrder({ variables: { restaurant_id } });
				const order_items = Object.values(state.items[restaurant_id]).map((v) => ({
					order_id: data.data.insert_order_one.id,
					food_id: v.id,
					price: v.price,
					quantity: v.quantity
				}));
				await insertOrderItems({ variables: { order_items } });
			} catch (err) {
				continue;
			}
		}
		dispatch({ type: RESET });
	};

	const value = {
		hasItem,
		getItems,
		updateCart,
		removeItem,
		removeRestaurant,
		checkout
	};

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
