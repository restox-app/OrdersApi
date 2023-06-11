export interface CART_ITEMS_SCHEMA extends Document {
  buyer_id: string,
  restaurant_id: string,
  menu_item_id: string,
  order_id?: string,
  qty: number,
  price: number,
  ordered: boolean,
}
