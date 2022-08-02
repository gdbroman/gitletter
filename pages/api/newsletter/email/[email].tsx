import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../../../prisma/prisma";
import { unstableGetServerSession } from "../../auth/getServerSession";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstableGetServerSession(req, res);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const email = req.query.email as string;

  if (!email) {
    return res.status(422).json({ message: "Missing email" });
  }

  if (req.method === "GET") {
    const result = await prisma.newsletter.findFirst({
      where: { author: { email } },
      select: { id: true },
    });

    res.status(200).json(result.id);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
