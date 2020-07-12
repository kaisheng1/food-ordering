import gql from 'graphql-tag';
const GET_RESTAURANT_FOOD = gql`
	query {
		restaurant {
			id
			name
			address
			phone_number
			food {
				id
				name
				price
			}
		}
	}
`;

export default GET_RESTAURANT_FOOD;
