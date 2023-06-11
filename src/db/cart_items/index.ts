import { Schema, SchemaTypes } from 'mongoose';
import { CART_ITEMS_SCHEMA } from './types';
import { db } from '../config';

const cart_items_schema = new Schema<CART_ITEMS_SCHEMA>({
  buyer_id: {
    type: SchemaTypes.String,
    required: true,
  },
  restaurant_id: {
    type: SchemaTypes.String,
    required: true,
  },
  menu_item_id: {
    type: SchemaTypes.String,
    required: true,
  },
  order_id: {
    type: SchemaTypes.String,
  },
  qty: {
    type: SchemaTypes.Number,
    required: true,
  },
  price: {
    type: SchemaTypes.Number,
    required: true,
  },
  ordered: {
    type: SchemaTypes.Boolean,
  },
}, {
  timestamps: true,
});

export const cart_items = db.model<CART_ITEMS_SCHEMA>(
  'cart_items',
  cart_items_schema,
);
