import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import { createIssue } from "../../../prisma/modules/issue";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const { title, content, newsletterId } = req.body;

  if (req.method === "POST") {
    const result = await createIssue(
      title,
      content,
      session.user.email,
      newsletterId
    );

    res.status(201).json(result);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
