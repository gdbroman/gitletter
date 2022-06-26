import { getSession } from "next-auth/react";

import prisma from "../../../prisma/prisma";

// POST & PUT /api/subscribers
export default async function handle(req, res) {
  const { email, newsletterId } = req.body;

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

    const result = await prisma.subscriber.create({
      data: {
        email,
        newsletter: { connect: { id: newsletterId } },
        addedAt: new Date(),
      },
    });
    res.json(result);
  } else if (req.method === "PUT") {
    // todo
  }
}
