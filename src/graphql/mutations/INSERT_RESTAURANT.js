import gql from 'graphql-tag';

const INSERT_RESTAURANT = gql`
	mutation($name: String!, $address: String, $phone_number: String) {
		insert_restaurant_one(object: { name: $name, address: $address, phone_number: $phone_number }) {
			id
		}
	}
`;

export default INSERT_RESTAURANT;
