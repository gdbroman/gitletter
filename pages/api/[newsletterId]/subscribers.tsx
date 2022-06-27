import { getSession } from "next-auth/react";

import prisma from "../../../prisma/prisma";

// POST & PUT /api/:newsletterId/subscribers
export default async function handle(req, res) {
  const { email } = req.body;
  const newsletterId = req.query.newsletterId;

  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    res.json({
      error: "Unauthenticated",
    });
    return;
  }

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
    const result = await prisma.subscriber.deleteMany({
      where: { email, newsletterId },
    });
    res.json(result);
  }
}
