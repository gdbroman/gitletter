import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import prisma from "../../../../prisma/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const result = await prisma.newsletter.findFirst({
    where: {
      id: req.query.newsletterId as string,
    },
    select: {
      subscribers: {
        select: {
          id: true,
        },
      },
    },
  });

  res.json(result.subscribers.length);
}
