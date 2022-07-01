import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../../../prisma/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const newsletterId = req.query.newsletterId as string;
  const { email, dontRedirect } = req.body;

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

    if (dontRedirect) {
      res.status(200).json({ message: "Subscriber added." });
    } else {
      res.redirect(`/app/${newsletterId}/success`);
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
