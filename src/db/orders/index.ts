import { Schema, SchemaTypes } from 'mongoose';
import { ORDERS_SCHEMA } from './types';
import { db } from '../config';

const orders_schema = new Schema<ORDERS_SCHEMA>({
  buyer_id: {
    type: SchemaTypes.String,
    required: true,
  },
  restaurant_id: {
    type: SchemaTypes.String,
    required: true,
  },
  notes: {
    type: SchemaTypes.Mixed,
  },
  status: {
    type: SchemaTypes.String,
    required: true,
  },
  payment_gateway: {
    type: SchemaTypes.String,
    required: true,
  },
  payment_status: {
    type: SchemaTypes.String,
    required: true,
  },
  gateway_details: {
    payment_id: {
      type: SchemaTypes.String,
    },
    order_id: {
      type: SchemaTypes.String,
    },
  },
}, {
  timestamps: true,
});

export const orders = db.model<ORDERS_SCHEMA>(
  'orders',
  orders_schema,
);
