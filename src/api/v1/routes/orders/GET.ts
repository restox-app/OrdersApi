import { JSONSchemaType } from 'ajv';
import { FastifySchema, RouteHandlerMethod } from 'fastify';
import { orders } from '../../../../db/orders';

export interface GetQuery {
  skip: number,
  limit: number,
}

const query_schema: JSONSchemaType<GetQuery> = {
  type: 'object',
  properties: {
    skip: {
      type: 'number',
      minimum: 0,
      maximum: 1000,
      default: 0,
    },
    limit: {
      type: 'number',
      minimum: 1,
      maximum: 100,
      default: 10,
    },
  },
  required: [],
  additionalProperties: false,
};

export const GET_validation_schema: FastifySchema = {
  querystring: query_schema,
};

export const GET_handler: RouteHandlerMethod = async (request, reply) => {
  const query = request.query as GetQuery;

  const { buyer } = request;

  const fetch_res = await orders
    .aggregate()
    .match({
      buyer_id: buyer._id.toHexString(),
    })
    .sort({
      createdAt: -1,
    })
    .skip(query.skip)
    .limit(query.limit + 1)
    .lookup({
      from: 'restaurants',
      as: 'restaurant',
      let: {
        restaurant_id: {
          $toObjectId: '$restaurant_id',
        },
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: [
                '$_id',
                '$$restaurant_id',
              ],
            },
          },
        },
      ],
    })
    .addFields({
      restaurant: {
        $first: '$restaurant',
      },
    })
    .lookup({
      from: 'cart_items',
      as: 'cart_items',
      let: {
        order_id: {
          $toString: '$_id',
        },
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: [
                '$order_id',
                '$$order_id',
              ],
            },
          },
        },
        {
          $lookup: {
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
          },
        },
        {
          $addFields: {
            menu_item: {
              $first: '$menu_item',
            },
          },
        },
      ],
    });

  const has_more = fetch_res.length > query.limit;

  reply.status(200).send({
    has_more,
    data: has_more ? fetch_res.slice(0, -1) : fetch_res,
  });
};
