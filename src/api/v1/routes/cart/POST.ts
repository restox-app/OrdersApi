import { JSONSchemaType } from 'ajv';
import { FastifySchema, RouteHandlerMethod } from 'fastify';
import { cart_items } from '../../../../db/cart_items';
import { menu_items } from '../../../../db/menu_items';

export interface PostBody {
  restaurant_id: string,
  menu_item_id: string,
  qty: number,
}

const body_schema: JSONSchemaType<PostBody> = {
  type: 'object',
  properties: {
    restaurant_id: {
      type: 'string',
    },
    menu_item_id: {
      type: 'string',
    },
    qty: {
      type: 'integer',
      minimum: 1,
      maximum: 10,
    },
  },
  required: [
    'restaurant_id',
    'menu_item_id',
    'qty',
  ],
  additionalProperties: false,
};

export const POST_validation_schema: FastifySchema = {
  body: body_schema,
};

export const POST_handler: RouteHandlerMethod = async (request, reply) => {
  const body = request.body as PostBody;

  const { buyer } = request;

  const fetch_res = await menu_items
    .findOne({
      _id: body.menu_item_id,
    });

  if (!fetch_res) {
    reply.status(404).send({
      type: 'OUT_OF_STOCK_ERROR',
      msg: 'Product is out of stock',
      error: 'out of stock',
    });
    return;
  }

  await cart_items
    .create({
      buyer_id: buyer._id,
      restaurant_id: body.restaurant_id,
      menu_item_id: body.menu_item_id,
      qty: body.qty,
      price: fetch_res.price,
      ordered: false,
    });

  reply.status(200).send();
};
