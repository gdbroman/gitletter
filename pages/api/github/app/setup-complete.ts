import { getSession } from "next-auth/react";

import prisma from "../../../../util/prisma";

// POST /api/github/app/setup-complete
export default async function handle(req, res) {
  const { installation_id } = req.query;

  const session = await getSession({ req });
  let newsLetter = await prisma.newsletter.findFirst({
    where: {
      author: { email: session?.user?.email },
    },
  });

  if (newsLetter) {
    console.log("Existing newsletter found", JSON.stringify(newsLetter));
  } else {
    const firstName = session?.user?.name?.split(" ")[0];
    newsLetter = await prisma.newsletter.create({
      data: {
        title: `${firstName}'s Newsletter`,
        description: `Hey friends! I'm ${firstName}. In this newsletter we explore...`,
        author: { connect: { email: session?.user?.email } },
      },
    });
    console.log("Created new newsletter", JSON.stringify(newsLetter, null, 2));
  }

  let githubIntegration = await prisma.githubIntegration.findFirst({
    where: {
      installationId: installation_id,
    },
  });

  if (githubIntegration) {
    console.log("Existing GitHub integration found");
  } else {
    githubIntegration = await prisma.githubIntegration.create({
      data: {
        installationId: installation_id,
        newsletter: { connect: { id: newsLetter.id } },
      },
    });
    console.log(
      "Created new GitHub integration",
      JSON.stringify(githubIntegration, null, 2)
    );
  }

  res.redirect("/app");
}
