import { getSession } from "next-auth/react";

import prisma from "../../src/prisma/prisma";

// POST /api/onboarding
// Required fields in body: title
export default async function handle(req, res) {
  const session = await getSession({ req });

  const hasExistingNewsletter = await prisma.newsletter.findFirst({
    where: {
      author: { email: session?.user?.email },
    },
  });

  if (hasExistingNewsletter) {
    console.log("User has a newsletter, redirecting to app");
    res.redirect("/app");
  } else {
    await prisma.newsletter.create({
      data: {
        title: `${session?.user?.name}'s letter`,
        author: { connect: { email: session?.user?.email } },
      },
    });
    console.log(
      `Created a new newsletter for ${session?.user?.email}, redirecting to settings`
    );
    res.redirect("/app/settings");
  }
}
