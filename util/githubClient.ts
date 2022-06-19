import { GithubIntegration } from "@prisma/client";

import {
  GithubReposDirs,
  UpdateGithubIntegrationInput,
} from "../pages/api/github/app/[...installationId]";

export async function getReposDirs(
  githubInstallationId: string
): Promise<GithubReposDirs | null> {
  const response = await fetch(
    `${process.env.APP_URL}/api/github/app/${githubInstallationId}`,
    {
      method: "GET",
    }
  );

  return responseHandler(response);
}

export async function getRepoContent(
  githubInstallationId: string
): Promise<GithubReposDirs | null> {
  const response = await fetch(
    `${process.env.APP_URL}/api/github/${githubInstallationId}`,
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
