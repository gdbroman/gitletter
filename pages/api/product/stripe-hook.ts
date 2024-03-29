import { buffer } from "micro";
import type { NextApiRequest, NextApiResponse } from "next/types";
import type Stripe from "stripe";

import { stripe } from "../../../prisma/modules/stripe";
import prisma from "../../../prisma/prisma";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const reqBuffer = await buffer(req);
  const signature = req.headers["stripe-signature"] as string;
  const signingSecret = process.env.STRIPE_SIGNING_SECRET as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(reqBuffer, signature, signingSecret);
  } catch (err: any) {
    console.log(err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const subscription = event.data.object as Stripe.Subscription;
  const stripeCustomerId = subscription.customer as string;

  switch (event.type) {
    case "customer.subscription.created":
      if (stripeCustomerId) {
        await prisma.user.update({
          where: {
            stripeCustomerId,
          },
          data: {
            stripeProductId: subscription.items.data[0].plan.product as string,
          },
        });
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.send({ received: true });
}
