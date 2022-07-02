import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import prisma from "../../../../prisma/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const newsletterId = req.query.newsletterId as string;

  if (req.method === "GET") {
    const result = await prisma.newsletter.findFirst({
      where: { id: newsletterId },
      include: { subscribers: true, githubIntegration: true },
    });

    res.status(200).json(result);
  } else if (req.method === "PUT") {
    const { title } = req.body;
    console.log("title", title);
    const result = await prisma.newsletter.update({
      where: { id: newsletterId },
      data: { title },
    });

    res.status(200).json(result);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}