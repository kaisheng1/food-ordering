import gql from 'graphql-tag';

const GET_ORDERS = gql`
	query {
		order {
			id
			created_at
			status
			driver_id
			restaurant {
				name
			}
			order_items {
				id
				price
				quantity
				food {
					id
					name
				}
			}
		}
	}
`;

export default GET_ORDERS;
