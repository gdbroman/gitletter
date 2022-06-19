import { createAppAuth } from "@octokit/auth-app";
import { Octokit, RestEndpointMethodTypes } from "@octokit/rest";
import { OctokitResponse } from "@octokit/types";
import { GithubIntegration } from "@prisma/client";

import prisma from "../../../../util/prisma";

export type GithubRepoData =
  RestEndpointMethodTypes["repos"]["getContent"]["response"]["data"];
export type GithubReposDirs = [string, string[]][];
export type UpdateGithubIntegrationInput = Pick<
  GithubIntegration,
  "repoName" | "repoDir"
>;

// GET, PUT, DELETE /api/github/app/:id
export default async function handler(req, res) {
  const installationId = req.query.installationId;

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
    const githubReposDirs = await getGithubReposDirs(installationId);
    res.send(githubReposDirs);
  }
}

async function getGithubReposDirs(installationId: string) {
  const client = createOctokitClient(installationId);
  const repos = await client.paginate(
    client.apps.listReposAccessibleToInstallation
  );
  const githubReposDirs: GithubReposDirs = await Promise.all(
    repos.map(async (repo) => {
      let directories: string[] = [];
      const repoContent: OctokitResponse<GithubRepoData> =
        await client.repos.getContent({
          repo: repo.name,
          owner: repo.owner.login,
          path: "",
        });
      if (Array.isArray(repoContent.data)) {
        directories = repoContent.data
          .filter(({ type }) => type === "dir")
          .map(({ path }) => path);
      }

      return [repo.name, directories];
    })
  );
  return githubReposDirs;
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

export function createOctokitClient(installationId?: string): Octokit {
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
}
