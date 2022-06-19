import { GithubIntegration } from "@prisma/client";

import { GithubReposDirs } from "../pages/api/github/app/[...installationId]";

export async function getReposDirs(
  githubInstallationId: string
): Promise<GithubReposDirs | null> {
  const response = await fetch(
    `${process.env.APP_URL}/api/github/app/${githubInstallationId}`,
    {
      method: "GET",
    }
  );
  if (response.ok) {
    return response.json();
  } else {
    console.error(response.statusText);
    return null;
  }
}

export async function deleteIntegration(
  githubInstallationId: string
): Promise<GithubIntegration | null> {
  const response = await fetch(
    `${process.env.APP_URL}/api/github/app/${githubInstallationId}`,
    {
      method: "DELETE",
    }
  );
  if (response.ok) {
    return response.json();
  } else {
    console.error(response.statusText);
    return null;
  }
}
