import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../../prisma/prisma";
import { unstableGetServerSession } from "../auth/[...nextauth]";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstableGetServerSession(req, res);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  if (req.method === "DELETE") {
    const subscriberId = req.query.subscriberId as string;

    const result = await prisma.subscriber.delete({
      where: { id: subscriberId },
    });

    res.status(200).json(result);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
