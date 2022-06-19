import { OctokitResponse } from "@octokit/types";

import prisma from "../../../util/prisma";
import { createOctokitClient, GithubRepoData } from "./app/[...installationId]";

// GET /api/github/:installationId?fileSlug=:fileSlug
export default async function handler(req, res) {
  const installationId = req.query.installationId;
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
      path: `${githubIntegration.repoDir}${filePath}`,
    });
  res.send(repoContent.data);
}
