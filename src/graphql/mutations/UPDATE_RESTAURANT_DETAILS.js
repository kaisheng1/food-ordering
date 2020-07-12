import gql from 'graphql-tag';

const UPDATE_RESTAURANT_DETAILS = gql`
	mutation($id: uuid!, $name: String, $phone_number: String, $address: String) {
		update_restaurant_by_pk(
			pk_columns: { id: $id }
			_set: { name: $name, phone_number: $phone_number, address: $address }
		) {
			id
			phone_number
			address
		}
	}
`;

export default UPDATE_RESTAURANT_DETAILS;
