import { getSession } from "next-auth/react";

import prisma from "../../../prisma/prisma";

// POST & PUT /api/issue
export default async function handle(req, res) {
  const { title, content, issueId, newsletterId } = req.body;

  const session = await getSession({ req });
  if (req.method === "POST") {
    const result = await prisma.issue.create({
      data: {
        title,
        content,
        newsletter: { connect: { id: newsletterId } },
        author: { connect: { email: session?.user?.email } },
      },
    });
    res.json(result);
  } else if (req.method === "PUT") {
    const result = await prisma.issue.update({
      where: { id: issueId },
      data: {
        title,
        content,
      },
    });
    res.json(result);
  } else if (req.method === "DELETE") {
    const result = await prisma.issue.delete({
      where: { id: issueId },
    });
    res.json(result);
  }
}
