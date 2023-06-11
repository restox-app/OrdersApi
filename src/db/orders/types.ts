export interface ORDERS_SCHEMA extends Document {
  buyer_id: string,
  restaurant_id: string,
  notes: string[],
  status: string,
  payment_gateway: string,
  payment_status: string,
  gateway_details: {
    payment_id: string,
    order_id: string,
  },
}
