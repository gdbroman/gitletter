import { getSession } from "next-auth/react";

import prisma from "../../../prisma/prisma";

// POST & PUT /api/issue
// Required fields in body: title, content, newsletterId
export default async function handle(req, res) {
  const { title, content, newsletterId, sent } = req.body;

  const session = await getSession({ req });
  if (req.method === "POST") {
    const result = await prisma.issue.create({
      data: {
        title,
        content,
        sent: false,
        newsletter: { connect: { id: newsletterId } },
        author: { connect: { email: session?.user?.email } },
      },
    });
    res.json(result);
  } else if (req.method === "PUT") {
    const result = await prisma.issue.update({
      where: { id: req.body.issueId },
      data: {
        title,
        content,
        sent,
      },
    });
    res.json(result);
  }
}
