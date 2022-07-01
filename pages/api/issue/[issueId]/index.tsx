import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import prisma from "../../../../prisma/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const issueId = req.query.issueId as string;
  const { title, content } = req.body;

  if (req.method === "PUT") {
    const result = await prisma.issue.update({
      where: { id: issueId },
      data: {
        title,
        content,
      },
    });

    res.status(200).json(result);
  } else if (req.method === "DELETE") {
    const result = await prisma.issue.delete({
      where: { id: issueId },
    });

    res.status(200).json(result);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
