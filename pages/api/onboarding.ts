import type { NextApiRequest, NextApiResponse } from "next";

import { populateIntroIssue } from "../../prisma/modules/issue";
import prisma from "../../prisma/prisma";
import { unstableGetServerSession } from "./auth/getServerSession";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstableGetServerSession(req, res);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const userEmail = session?.user?.email;
  const existingNewsletter = await prisma.newsletter.findFirst({
    where: {
      author: { email: userEmail },
    },
  });

  let newsletterId;
  if (existingNewsletter) {
    console.info("ONBOARDING", `${userEmail} has a newsletter.`);
    newsletterId = existingNewsletter.id;
  } else {
    console.info("ONBOARDING", `Creating newsletter for ${userEmail}.`);
    const newNewsletter = await prisma.newsletter.create({
      data: {
        title: `${session?.user?.name.split(" ")[0]}'s letter`,
        author: { connect: { email: userEmail } },
      },
    });
    newsletterId = newNewsletter.id;

    console.info("ONBOARDING", `Populating newsletter with intro issue.`);
    await populateIntroIssue(newNewsletter.id);
  }

  console.info("ONBOARDING", "Redirecting to app.");
  res.redirect(`/app/${newsletterId}`);
}
