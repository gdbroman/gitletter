import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../../../prisma/prisma";
import { getAppBasePath } from "../../../../util/hooks/useAppHref";

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
    }

    res.redirect(`${getAppBasePath(newsletterId)}/unsubscribed`);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
