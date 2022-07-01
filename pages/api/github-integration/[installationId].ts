import { RestEndpointMethodTypes } from "@octokit/rest";
import { GithubIntegration } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import prisma from "../../../prisma/prisma";

export type GithubRepoData =
  RestEndpointMethodTypes["repos"]["getContent"]["response"]["data"];
export type RepoInfo = {
  dir: string;
  owner: string;
};
export type GithubReposInfo = [string, RepoInfo[]][];
export type UpdateGithubIntegrationInput = Pick<
  GithubIntegration,
  "repoName" | "repoDir" | "repoOwner"
>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const installationId = req.query.installationId as string;

  if (req.method === "GET") {
    const integration = await getIntegration(installationId);
    res.json(integration);
  } else if (req.method === "DELETE") {
    const integration = await deleteIntegration(installationId);
    res.json(integration);
  } else if (req.method === "PUT") {
    const integration = await updateIntegration(
      installationId,
      JSON.parse(req.body)
    );
    res.json(integration);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

function getIntegration(installationId: string) {
  try {
    return prisma.githubIntegration.findFirst({
      where: {
        installationId,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

function updateIntegration(
  installationId: string,
  data: UpdateGithubIntegrationInput
) {
  try {
    return prisma.githubIntegration.update({
      where: {
        installationId,
      },
      data,
    });
  } catch (error) {
    console.error(error);
  }
}

function deleteIntegration(installationId: string) {
  try {
    return prisma.githubIntegration.delete({
      where: {
        installationId,
      },
    });
  } catch (error) {
    console.error(error);
  }
}
