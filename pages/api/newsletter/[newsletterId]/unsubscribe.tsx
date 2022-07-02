import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../../../prisma/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const newsletterId = req.query.newsletterId as string;

  if (req.method === "GET") {
    const email = req.query.email as string;
    const subscriber = await prisma.subscriber.findFirst({
      where: { email, newsletterId },
      select: { id: true },
    });
    await prisma.subscriber.delete({
      where: { id: subscriber.id },
    });

    res.redirect(`/app/${newsletterId}/unsubscribed`);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
