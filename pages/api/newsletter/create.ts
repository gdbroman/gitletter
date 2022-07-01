import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import prisma from "../../../prisma/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  if (req.method === "POST") {
    const { title, description } = req.body;

    const result = await prisma.newsletter.create({
      data: {
        title,
        description,
        author: { connect: { email: session?.user?.email } },
      },
    });

    res.status(201).json(result);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
