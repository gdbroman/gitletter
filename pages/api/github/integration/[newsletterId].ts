import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../../../prisma/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
