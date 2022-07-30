import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../../prisma/prisma";
import { unstableGetServerSession } from "../auth/[...nextauth]";

// Webhook for GitHub app post installation
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstableGetServerSession(req, res);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const { installation_id } = req.query;

  if (req.method === "GET") {
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
      console.log(
        "Created new newsletter",
        JSON.stringify(newsLetter, null, 2)
      );
    }

    let githubIntegration = await prisma.githubIntegration.findFirst({
      where: {
        installationId: installation_id as string,
      },
    });

    if (githubIntegration) {
      console.log("Existing GitHub integration found");
    } else {
      githubIntegration = await prisma.githubIntegration.create({
        data: {
          installationId: installation_id as string,
          newsletter: { connect: { id: newsLetter.id } },
        },
      });
      console.log(
        "Created new GitHub integration",
        JSON.stringify(githubIntegration, null, 2)
      );
    }

    res.redirect("/app/settings");
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
