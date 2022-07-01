import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import prisma from "../../../../prisma/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const newsletterId = req.query.installationId as string;

  if (req.method === "GET") {
    const integration = await prisma.githubIntegration.findFirst({
      where: {
        newsletterId,
      },
    });

    res.json(integration);
  }
}
