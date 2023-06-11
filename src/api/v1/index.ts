import { FastifyPluginAsync } from 'fastify';
import { DecodedIdToken } from 'firebase-admin/auth';
import { Types } from 'mongoose';
import { BUYERS_SCHEMA } from '../../db/buyers/types';

import * as index from './routes';
import { verify_firebase_id_token } from './plugins/verify_firebase_id_token';
import { fetch_buyer } from './plugins/fetch_user';

declare module 'fastify' {
  interface FastifyRequest {
    decoded_token: DecodedIdToken
    buyer: BUYERS_SCHEMA & {
      _id: Types.ObjectId;
    }
  }
}

export const v1: FastifyPluginAsync = async (instance, _opts) => {
  instance.decorateRequest('decoded_token', null);
  instance.decorateRequest('buyer', null);

  instance.route({
    url: '/cart',
    method: 'POST',
    schema: index.cart.POST_validation_schema,
    preHandler: [
      verify_firebase_id_token,
      fetch_buyer,
    ],
    handler: index.cart.POST_handler,
  });

  instance.route({
    url: '/cart',
    method: 'GET',
    schema: index.cart.GET_validation_schema,
    preHandler: [
      verify_firebase_id_token,
      fetch_buyer,
    ],
    handler: index.cart.GET_handler,
  });

  instance.route({
    url: '/cart/:cart_item_id',
    method: 'DELETE',
    schema: index.cart.dynamic.DELETE_validation_schema,
    preHandler: [
      verify_firebase_id_token,
      fetch_buyer,
    ],
    handler: index.cart.dynamic.DELETE_handler,
  });

  instance.route({
    url: '/cart/:cart_item_id',
    method: 'PATCH',
    schema: index.cart.dynamic.PATCH_validation_schema,
    preHandler: [
      verify_firebase_id_token,
      fetch_buyer,
    ],
    handler: index.cart.dynamic.PATCH_handler,
  });

  instance.route({
    url: '/orders',
    method: 'POST',
    schema: index.orders.POST_validation_schema,
    preHandler: [
      verify_firebase_id_token,
      fetch_buyer,
    ],
    handler: index.orders.POST_handler,
  });

  instance.route({
    url: '/orders',
    method: 'GET',
    schema: index.orders.GET_validation_schema,
    preHandler: [
      verify_firebase_id_token,
      fetch_buyer,
    ],
    handler: index.orders.GET_handler,
  });
};
