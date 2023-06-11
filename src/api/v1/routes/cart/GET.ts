import { FastifySchema, RouteHandlerMethod } from 'fastify';
import { JSONSchemaType } from 'ajv';
import { cart_items } from '../../../../db/cart_items';

export interface GetQuery {
  restaurant_id: string,
}

const query_schema: JSONSchemaType<GetQuery> = {
  type: 'object',
  properties: {
    restaurant_id: {
      type: 'string',
    },
  },
  required: [
    'restaurant_id',
  ],
  additionalProperties: false,
};

export const GET_validation_schema: FastifySchema = {
  querystring: query_schema,
};

export const GET_handler: RouteHandlerMethod = async (request, reply) => {
  const query = request.query as GetQuery;

  const { buyer } = request;

  const fetch_res = await cart_items
    .aggregate()
    .match({
      restaurant_id: query.restaurant_id,
      buyer_id: buyer._id.toHexString(),
      ordered: false,
    })
    .lookup({
      from: 'menu_items',
      as: 'menu_item',
      let: {
        menu_item_id: {
          $toObjectId: '$menu_item_id',
        },
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: [
                '$_id',
                '$$menu_item_id',
              ],
            },
          },
        },
      ],
    })
    .addFields({
      menu_item: {
        $first: '$menu_item',
      },
    });

  reply.status(200).send(fetch_res);
};
