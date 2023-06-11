import { Schema, SchemaTypes } from 'mongoose';
import { db } from '../config';
import { MENU_ITEMS_SCHEMA } from './types';

const menu_items_schema = new Schema<MENU_ITEMS_SCHEMA>({
  restaurant_id: {
    type: SchemaTypes.String,
    required: true,
  },
  name: {
    type: SchemaTypes.String,
    required: true,
  },
  image: {
    type: SchemaTypes.String,
    required: true,
  },
  price: {
    type: SchemaTypes.Number,
    required: true,
  },
}, {
  timestamps: true,
});

export const menu_items = db.model<MENU_ITEMS_SCHEMA>(
  'menu_items',
  menu_items_schema,
);
