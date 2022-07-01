import { OctokitResponse } from "@octokit/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import prisma from "../../../prisma/prisma";
import { createOctokitClient, GithubRepoData } from "./app/[...installationId]";

// GET /api/github/:installationId?fileSlug=:fileSlug
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const installationId = req.query.installationId as string;
  const fileSlug = req.query.fileSlug;
  const filePath = fileSlug ? `/${fileSlug}` : "";
  const githubIntegration = await prisma.githubIntegration.findFirst({
    where: {
      installationId,
    },
  });

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
