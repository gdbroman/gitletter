import { OctokitResponse } from "@octokit/types";

import prisma from "../../../util/prisma";
import { createOctokitClient, GithubRepoData } from "./app/[...installationId]";

// GET /api/github/:id
export default async function handler(req, res) {
  const installationId = req.query.installationId;
  const githubIntegration = await prisma.githubIntegration.findFirst({
    where: {
      installationId,
    },
  });

  const client = createOctokitClient(installationId);
  const repoContent: OctokitResponse<GithubRepoData> =
    await client.repos.getContent({
      repo: githubIntegration.repoName,
      owner: "gdbroman",
      path: githubIntegration.repoDir,
    });
  res.send(repoContent.data);
}
