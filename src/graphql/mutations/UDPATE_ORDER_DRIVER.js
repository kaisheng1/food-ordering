import gql from 'graphql-tag';

const UPDATE_ORDER_DRIVER = gql`
	mutation($id: uuid!) {
		update_order_by_pk(pk_columns: { id: $id }, _set: {}) {
			id
			driver_id
		}
	}
`;

export default UPDATE_ORDER_DRIVER;
