import type { OctokitResponse } from "@octokit/types";
import type { NextApiRequest, NextApiResponse } from "next";

import type { GithubRepoData } from "../../../../prisma/modules/github";
import { createOctokitClient } from "../../../../prisma/modules/github";
import prisma from "../../../../prisma/prisma";
import { unstableGetServerSession } from "../../auth/getServerSession";

// GET /api/github/:installationId?fileSlug=:fileSlug
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstableGetServerSession(req, res);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const installationId = req.query.installationId as string;
  const fileSlug = req.query.fileSlug;
  const filePath = fileSlug ? `/${fileSlug}` : "";
  const githubIntegration = await prisma.githubIntegration.findFirst({
    where: {
      installationId,
    },
  });

  if (
    !githubIntegration ||
    !githubIntegration.repoName ||
    !githubIntegration.repoOwner
  ) {
    return res.status(404).json({ message: "Not found" });
  }

  const client = createOctokitClient(installationId);
  const repoContent: OctokitResponse<GithubRepoData> =
    await client.repos.getContent({
      repo: githubIntegration.repoName,
      owner: githubIntegration.repoOwner,
      path: `${
        githubIntegration.repoDir === "./" ? "" : githubIntegration.repoDir
      }${filePath}`,
    });

  res.send(repoContent.data);
}
