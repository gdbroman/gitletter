import type { NextApiRequest, NextApiResponse } from "next";

import { stripe } from "../../../prisma/modules/stripe";
import prisma from "../../../prisma/prisma";
import { getAppBasePath } from "../../../util/hooks/useAppHref";
import { unstableGetServerSession } from "../auth/getServerSession";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstableGetServerSession(req, res);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  if (req.method === "GET") {
    const { priceId } = req.query;

    const user = await prisma.user.findFirst({
      where: { email: session?.user?.email },
      include: {
        newsletter: true,
      },
    });

    await prisma.$disconnect();

    const lineItems = [
      {
        price: priceId as string,
        quantity: 1,
      },
    ];

    const stripeSession = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${process.env.APP_URL}${getAppBasePath(
        user.newsletter.id
      )}/settings`,
      cancel_url: `${process.env.APP_URL}${getAppBasePath(
        user.newsletter.id
      )}/settings`,
      metadata: {
        userId: user.id,
      },
    });

    res.status(200).json(stripeSession.id);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
