import { GithubIntegration } from "@prisma/client";

import {
  GithubReposInfo,
  UpdateGithubIntegrationInput,
} from "../pages/api/github/app/[...installationId]";

export async function getReposInfo(
  githubInstallationId: string
): Promise<GithubReposInfo | null> {
  const response = await fetch(
    `${process.env.APP_URL}/api/github/app/${githubInstallationId}`,
    {
      method: "GET",
    }
  );

  return responseHandler(response);
}

export async function getRepoContent(
  githubInstallationId: string,
  fileSlug?: string
): Promise<any | null> {
  const response = await fetch(
    `${process.env.APP_URL}/api/github/${githubInstallationId}${
      fileSlug ? `?fileSlug=${fileSlug}` : ""
    }`,
    {
      method: "GET",
    }
  );

  return responseHandler(response);
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

  return responseHandler(response);
}

export async function updateIntegration(
  githubInstallationId: string,
  updateGithubIntegrationInput: UpdateGithubIntegrationInput
): Promise<GithubIntegration | null> {
  const response = await fetch(
    `${process.env.APP_URL}/api/github/app/${githubInstallationId}`,
    {
      method: "PUT",
      body: JSON.stringify(updateGithubIntegrationInput),
    }
  );

  return responseHandler(response);
}

const responseHandler = (response: Response) => {
  if (response.ok) {
    return response.json();
  } else {
    console.error(response.statusText);
    return null;
  }
};
