import gql from 'graphql-tag';

const UPDATE_FOOD = gql`
	mutation($id: uuid!, $name: String, $price: numeric) {
		update_food_by_pk(pk_columns: { id: $id }, _set: { name: $name, price: $price }) {
			id
			name
			price
		}
	}
`;

export default UPDATE_FOOD;
