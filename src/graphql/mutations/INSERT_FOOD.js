import gql from 'graphql-tag';
const INSERT_FOOD = gql`
	mutation($name: String!, $price: numeric, $restaurant_id: uuid!) {
		insert_food_one(object: { name: $name, price: $price, restaurant_id: $restaurant_id }) {
			id
			name
			price
			restaurant_id
		}
	}
`;

export default INSERT_FOOD;
