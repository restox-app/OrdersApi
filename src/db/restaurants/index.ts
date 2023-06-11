import { Schema, SchemaTypes } from 'mongoose';
import { db } from '../config';
import { RESTAURANTS_SCHEMA } from './types';

const restaurants_schema = new Schema<RESTAURANTS_SCHEMA>({
  name: {
    type: SchemaTypes.String,
    maxlength: 256,
    required: true,
  },
  email: {
    type: SchemaTypes.String,
    maxlength: 256,
    required: true,
  },
  contact: {
    type: SchemaTypes.String,
    maxlength: 32,
  },
  address: {
    line1: {
      type: SchemaTypes.String,
      maxlength: 128,
      required: true,
    },
    line2: {
      type: SchemaTypes.String,
      maxlength: 128,
    },
    city: {
      type: SchemaTypes.String,
      maxlength: 64,
      required: true,
    },
    state: {
      type: SchemaTypes.String,
      maxlength: 64,
      required: true,
    },
    pin_code: {
      type: SchemaTypes.String,
      maxlength: 10,
      required: true,
    },
  },
}, {
  timestamps: true,
});

export const restaurants = db.model<RESTAURANTS_SCHEMA>(
  'restaurants',
  restaurants_schema,
);
