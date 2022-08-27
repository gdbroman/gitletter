import { createAppAuth } from "@octokit/auth-app";
import { Octokit, RestEndpointMethodTypes } from "@octokit/rest";
import { OctokitResponse } from "@octokit/types";

export type GithubRepoData =
  RestEndpointMethodTypes["repos"]["getContent"]["response"]["data"];
export type RepoInfo = {
  dir: string;
  owner: string;
};
export type GithubReposInfo = [string, RepoInfo[]][];

export async function getGithubRepos(installationId: string) {
  const client = createOctokitClient(installationId);
  const repos = await client.paginate(
    client.apps.listReposAccessibleToInstallation
  );

  const githubReposInfo: GithubReposInfo = await Promise.all(
    repos.map(async (repo) => {
      let infos: RepoInfo[] = [];
      const repoContentData = [
        {
          type: "dir",
          path: "./",
        } as any,
      ];

      const directories = await getRepoDirectoriesRecursively(client, repo);
      repoContentData.push(...directories);

      // Reformat the data as directory-owner paths
      infos = repoContentData.map(({ path }) => ({
        dir: path,
        owner: repo.owner.login,
      }));

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

async function fetchRepoContent(client: Octokit, repo: any, path: string) {
  try {
    return client.repos.getContent({
      repo: repo.name,
      owner: repo.owner.login,
      path,
    });
  } catch (error) {
    console.error("Could not get repo content, perhaps it's empty.");
  }
}

async function getRepoDirectoriesRecursively(
  client: Octokit,
  repo: any,
  path = ""
) {
  // Only recurse two levels deep
  if (path.split("/").length > 2) {
    return [];
  }

  const repoContent: OctokitResponse<GithubRepoData> = await fetchRepoContent(
    client,
    repo,
    path
  );
  const directories = Array.isArray(repoContent.data)
    ? repoContent.data.filter((item) => item.type === "dir")
    : [];

  if (directories.length === 0) {
    return [];
  }

  const subDirectories = await Promise.all(
    directories.map(async (directory) => {
      const subDirectories = await getRepoDirectoriesRecursively(
        client,
        repo,
        [path, directory.name].join("/")
      );
      return subDirectories;
    })
  );

  return [...directories, ...subDirectories.flat()];
}
