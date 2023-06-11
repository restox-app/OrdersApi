import { JSONSchemaType } from 'ajv';
import { FastifySchema, RouteHandlerMethod } from 'fastify';
// eslint-disable-next-line import/no-extraneous-dependencies
import Razorpay from 'razorpay';
import { db } from '../../../../db/config';
import { cart_items } from '../../../../db/cart_items';
import { orders } from '../../../../db/orders';

const razorpay_instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export interface PostBody {
  pg: boolean,
  restaurant_id: string,
}

const body_schema: JSONSchemaType<PostBody> = {
  type: 'object',
  properties: {
    pg: {
      type: 'boolean',
      default: false,
    },
    restaurant_id: {
      type: 'string',
    },
  },
  required: [
    'pg',
    'restaurant_id',
  ],
  additionalProperties: false,
};

export const POST_validation_schema: FastifySchema = {
  body: body_schema,
};

export const POST_handler: RouteHandlerMethod = async (request, reply) => {
  const { buyer } = request;

  const body = request.body as PostBody;

  const session = await db.startSession();

  session.startTransaction();

  const cart_res = await cart_items
    .aggregate()
    .match({
      buyer_id: buyer._id.toHexString(),
      restaurant_id: body.restaurant_id,
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
                '$$menu_item_id',
                '$_id',
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
    })
    .session(session);

  if (cart_res.length === 0) {
    await session.abortTransaction();
    await session.endSession();
    reply.status(404).send({
      type: 'BAG_EMPTY_ERROR',
      msg: 'Add Something to Bag',
      error: 'bag empty',
    });
    return;
  }

  let p_obj = {
    payment_gateway: 'mock',
    gateway_details: {
      payment_id: 'mock',
      order_id: 'mock',
    },
  };

  if (body.pg) {
    let amount = 0;

    cart_res.forEach((l) => {
      amount += l.menu_item.price;
    });

    const res = await razorpay_instance.orders.create({
      amount: amount * 100,
      currency: 'INR',
      notes: {
        order_for: 'bookings',
      },
    });

    p_obj = {
      payment_gateway: 'razorpay',
      gateway_details: {
        payment_id: '',
        order_id: res.id,
      },
    };
  }

  const order_res = await orders
    .create([{
      buyer_id: buyer._id,
      restaurant_id: body.restaurant_id,
      notes: [],
      status: 'confirmed',
      payment_gateway: p_obj.payment_gateway,
      payment_status: 'paid',
      gateway_details: p_obj.gateway_details,
    }], {
      session,
    });

  const ids: string[] = [];

  cart_res.forEach((l) => {
    ids.push(l._id);
  });

  await cart_items
    .updateMany({
      _id: {
        $in: ids,
      },
    }, {
      $set: {
        ordered: true,
        order_id: order_res[0]._id,
      },
    }, {
      multi: true,
      session,
    });

  await session.commitTransaction();
  await session.endSession();

  reply.status(200).send(order_res[0]);
};
