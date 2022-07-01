import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import prisma from "../../../../prisma/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const newsletterId = req.query.newsletterId as string;
  const { email } = req.body;

  if (req.method === "POST") {
    const existingSubscriber = await prisma.subscriber.findFirst({
      where: { email, newsletterId },
    });
    if (existingSubscriber) {
      return res.status(409).json({ message: "Subscriber already exists." });
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

    res.status(200).json(result);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
