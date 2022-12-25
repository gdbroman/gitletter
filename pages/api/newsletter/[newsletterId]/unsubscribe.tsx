import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../../../prisma/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const newsletterId = req.query.newsletterId as string;

  if (req.method === "POST") {
    const { email } = req.body;
    const subscriber = await prisma.subscriber.findFirst({
      where: { email, newsletterId },
      select: { id: true },
    });

    if (subscriber) {
      await prisma.subscriber.delete({
        where: { id: subscriber.id },
      });

      return res.status(200).json({ message: "Unsubscribed" });
    }

    return res.status(404).json({ message: "Subscriber not found" });
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
