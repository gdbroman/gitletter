import { createAppAuth } from "@octokit/auth-app";
import { Octokit, RestEndpointMethodTypes } from "@octokit/rest";
import { OctokitResponse } from "@octokit/types";
import { GithubIntegration } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../../../prisma/prisma";

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

// GET, PUT, DELETE /api/github/app/:id
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const installationId = req.query.installationId[0];

  if (req.method === "DELETE") {
    const integration = await deleteIntegration(installationId);
    res.json(integration);
  } else if (req.method === "PUT") {
    const integration = await updateIntegration(
      installationId,
      JSON.parse(req.body)
    );
    res.json(integration);
  } else {
    const githubReposInfo = await getGithubReposInfo(installationId);
    res.send(githubReposInfo);
  }
}

async function getGithubReposInfo(installationId: string) {
  const client = createOctokitClient(installationId);
  const repos = await client.paginate(
    client.apps.listReposAccessibleToInstallation
  );

  const githubReposInfo: GithubReposInfo = await Promise.all(
    repos.map(async (repo) => {
      let infos: RepoInfo[] = [];
      try {
        const repoContent: OctokitResponse<GithubRepoData> =
          await client.repos.getContent({
            repo: repo.name,
            owner: repo.owner.login,
            path: "",
          });
        if (Array.isArray(repoContent.data)) {
          infos = repoContent.data
            .filter(({ type }) => type === "dir")
            .map(({ path }) => ({ dir: path, owner: repo.owner.login }));
        }
      } catch (error) {
        console.error(error);
      }

      return [repo.name, infos];
    })
  );
  return githubReposInfo;
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

export const createOctokitClient = (installationId?: string): Octokit => {
  const appId = process.env.GITHUB_APP_ID;
  const privateKeyBase64 = process.env.GITHUB_APP_PRIVATE_KEY as string;
  const privateKey = Buffer.from(privateKeyBase64, "base64").toString();

  return new Octokit(
    !!installationId
      ? {
          authStrategy: createAppAuth,
          auth: {
            appId,
            privateKey,
            installationId,
          },
        }
      : undefined
  );
};
