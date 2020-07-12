import gql from 'graphql-tag';

const INSERT_ORDER_ITEMS = gql`
	mutation insertOrderItems($order_items: [order_item_insert_input!]!) {
		insert_order_item(objects: $order_items) {
			affected_rows
		}
	}
`;

export default INSERT_ORDER_ITEMS;
