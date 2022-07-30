import type { NextApiRequest, NextApiResponse } from "next";

import { populateIntroIssue } from "../../prisma/modules/issue";
import prisma from "../../prisma/prisma";
import { unstableGetServerSession } from "./auth/[...nextauth]";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstableGetServerSession(req, res);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const userEmail = session?.user?.email;
  const hasExistingNewsletter = await prisma.newsletter.findFirst({
    where: {
      author: { email: userEmail },
    },
  });

  if (hasExistingNewsletter) {
    console.log("ONBOARDING", `${userEmail} has a newsletter.`);
  } else {
    console.log("ONBOARDING", `Creating newsletter for ${userEmail}.`);
    const newNewsletter = await prisma.newsletter.create({
      data: {
        title: `${session?.user?.name.split(" ")[0]}'s letter`,
        author: { connect: { email: userEmail } },
      },
    });

    console.log("ONBOARDING", `Populating newsletter with intro issue.`);
    await populateIntroIssue(userEmail, newNewsletter.id);
  }

  console.log("ONBOARDING", "Redirecting to app.");
  res.redirect("/app");
}
