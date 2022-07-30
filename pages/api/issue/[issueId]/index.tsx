import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../../../prisma/prisma";
import { unstableGetServerSession } from "../../auth/getServerSession";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstableGetServerSession(req, res);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const issueId = req.query.issueId as string;
  const { fileName, content } = req.body;

  if (req.method === "PUT") {
    const result = await prisma.issue.update({
      where: { id: issueId },
      data: {
        fileName,
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
