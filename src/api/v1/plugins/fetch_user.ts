import { preHandlerHookHandler } from 'fastify';
import { buyers } from '../../../db/buyers';

export const fetch_buyer: preHandlerHookHandler = async (request, reply) => {
  const { decoded_token } = request;

  const fetch_res = await buyers
    .findOne({
      email: decoded_token.email,
    });

  if (fetch_res) {
    request.buyer = fetch_res;

    return;
  }

  reply.status(400).send({
    type: 'BUYER_NOT_FOUND_ERROR',
    msg: 'Buyer not found',
    error: 'buyer is not added to database',
  });
};
