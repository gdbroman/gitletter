import { createAppAuth } from "@octokit/auth-app";
import { Octokit, RestEndpointMethodTypes } from "@octokit/rest";
import { OctokitResponse } from "@octokit/types";

import prisma from "../../../../util/prisma";

type GithubRepoData =
  RestEndpointMethodTypes["repos"]["getContent"]["response"]["data"];
export type GithubReposDirs = [string, string[]][];

// DELETE & GET/api/github/app/:id
export default async function handler(req, res) {
  const installationId = req.query.installationId[0];

  if (req.method === "DELETE") {
    const integration = await deleteIntegration(installationId);
    res.json(integration);
  } else {
    const client = createClient(installationId);
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

    res.send(githubReposDirs);
  }
}

function createClient(installationId?: number): Octokit {
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
