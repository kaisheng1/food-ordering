import gql from 'graphql-tag';

const UPDATE_ORDER_STATUS = gql`
	mutation($id: uuid!, $status: order_status_enum!) {
		update_order_by_pk(pk_columns: { id: $id }, _set: { status: $status }) {
			id
			status
		}
	}
`;

export default UPDATE_ORDER_STATUS;
