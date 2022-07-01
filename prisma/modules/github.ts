import { createAppAuth } from "@octokit/auth-app";
import { Octokit, RestEndpointMethodTypes } from "@octokit/rest";
import { OctokitResponse } from "@octokit/types";
import { GithubIntegration } from "@prisma/client";

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

export async function getGithubRepos(installationId: string) {
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
          const repoContentData = repoContent.data;
          repoContentData.push({
            type: "dir",
            path: "./",
          } as any);

          infos = repoContentData
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
