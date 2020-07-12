import gql from 'graphql-tag';

const INSERT_ORDER = gql`
	mutation insertOrder($restaurant_id: uuid!) {
		insert_order_one(object: { restaurant_id: $restaurant_id }) {
			id
		}
	}
`;

export default INSERT_ORDER;
