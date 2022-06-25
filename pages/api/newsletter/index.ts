import { getSession } from "next-auth/react";

import prisma from "../../../prisma/prisma";

// POST /api/newsletter
// Required fields in body: title
export default async function handle(req, res) {
  const { title, description } = req.body;

  const session = await getSession({ req });
  const result = await prisma.newsletter.create({
    data: {
      title,
      description,
      author: { connect: { email: session?.user?.email } },
    },
  });
  res.json(result);
}
