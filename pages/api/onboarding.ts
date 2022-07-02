import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import prisma from "../../prisma/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
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
    await composeIntroIssue(userEmail, newNewsletter.id);
  }

  console.log("ONBOARDING", "Redirecting to app.");
  res.redirect("/app");
}

const composeIntroIssue = async (userEmail: string, newsletterId: string) => {
  const content = [
    "## Hey there 👋",
    "Before we get going, click **Preview** down below",
    "Ah, much better! As you can gather, this is a markdown editor",
    "It's where the magic happens ✨",
    "And I think that's all you need to know",
    "Now let's get writing!",
    "---",
    "## About me",
    "I'm Gustaf, the creator of GitLetter",
    "My goal is to help you compose with joy 🕊",
    "So if you have suggestions, don't hesitate to reach out",
    "Talk soon,",
    "Gustaf (@gdbroman on Twitter)",
  ].join("\n\n");

  await prisma.issue.create({
    data: {
      title: "Composing with joy 🕊",
      content,
      author: { connect: { email: userEmail } },
      newsletter: { connect: { id: newsletterId } },
    },
  });
};
