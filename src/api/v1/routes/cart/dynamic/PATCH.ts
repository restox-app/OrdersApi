import { JSONSchemaType } from 'ajv';
import { FastifySchema, RouteHandlerMethod } from 'fastify';
import { cart_items } from '../../../../../db/cart_items';

export interface PatchParams {
  cart_item_id: string,
}

export interface PatchQuery {
  qty: 'increment' | 'decrement',
}

const params_schema: JSONSchemaType<PatchParams> = {
  type: 'object',
  properties: {
    cart_item_id: {
      type: 'string',
    },
  },
  required: [
    'cart_item_id',
  ],
  additionalProperties: false,
};

const query_schema: JSONSchemaType<PatchQuery> = {
  type: 'object',
  properties: {
    qty: {
      type: 'string',
      enum: [
        'increment',
        'decrement',
      ],
    },
  },
  required: [
    'qty',
  ],
  additionalProperties: false,
};

export const PATCH_validation_schema: FastifySchema = {
  params: params_schema,
  querystring: query_schema,
};

export const PATCH_handler: RouteHandlerMethod = async (request, reply) => {
  const params = request.params as PatchParams;

  const query = request.query as PatchQuery;

  const { buyer } = request;

  await cart_items
    .updateOne({
      _id: params.cart_item_id,
      buyer_id: buyer._id,
      ordered: false,
    }, {
      $inc: {
        qty: query.qty === 'increment' ? 1 : -1,
      },
    });

  reply.status(200).send();
};
