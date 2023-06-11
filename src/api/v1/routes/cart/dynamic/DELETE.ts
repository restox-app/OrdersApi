import { JSONSchemaType } from 'ajv';
import { FastifySchema, RouteHandlerMethod } from 'fastify';
import { cart_items } from '../../../../../db/cart_items';

export interface DeleteParams {
  cart_item_id: string,
}

const params_schema: JSONSchemaType<DeleteParams> = {
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

export const DELETE_validation_schema: FastifySchema = {
  params: params_schema,
};

export const DELETE_handler: RouteHandlerMethod = async (request, reply) => {
  const params = request.params as DeleteParams;

  const { buyer } = request;

  await cart_items
    .deleteOne({
      _id: params.cart_item_id,
      buyer_id: buyer._id,
      ordered: false,
    });

  reply.status(200).send();
};
