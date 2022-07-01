import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import prisma from "../../../../prisma/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  if (req.method === "GET") {
    const newsletterId = req.query.newsletterId as string;

    const result = await prisma.newsletter.findFirst({
      where: { id: newsletterId },
      include: { subscribers: true, githubIntegration: true },
    });

    res.json(result);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
