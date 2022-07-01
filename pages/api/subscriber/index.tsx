import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import prisma from "../../../prisma/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, newsletterId } = req.body;

  if (req.method === "POST") {
    const existingSubscriber = await prisma.subscriber.findFirst({
      where: { email, newsletterId },
    });
    if (existingSubscriber) {
      res.statusCode = 409;
      res.send("Subscriber already exists.");
      return;
    }

    await prisma.subscriber.create({
      data: {
        email,
        newsletter: { connect: { id: newsletterId } },
        addedAt: new Date(),
      },
    });

    res.redirect(`/app/${newsletterId}/success`);
  } else if (req.method === "DELETE") {
    const session = await getSession({ req });
    if (!session) return res.status(401).json({ message: "Unauthorized" });

    const result = await prisma.subscriber.deleteMany({
      where: { email, newsletterId },
    });
    res.statusCode = 200;
    res.json(result);
  }
}
