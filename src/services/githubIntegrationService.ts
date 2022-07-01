import { GithubIntegration } from "@prisma/client";

import {
  GithubReposInfo,
  UpdateGithubIntegrationInput,
} from "../../prisma/modules/github";
import { fetchApi } from "./util";

const getGithubIntegration = async (installationId: string) =>
  fetchApi<GithubIntegration>(`/github-integration/${installationId}`);

const deleteGithubIntegration = async (installationId: string) =>
  fetchApi<GithubIntegration>(
    `/github-integration/${installationId}`,
    "DELETE"
  );

const updateGithubIntegration = async (
  installationId: string,
  updateGithubIntegrationInput: UpdateGithubIntegrationInput
) =>
  fetchApi<GithubIntegration>(
    `/github-integration/${installationId}`,
    "PUT",
    updateGithubIntegrationInput
  );

// Not using these atm
export const getReposInfo = async (installationId: string) =>
  fetchApi<GithubReposInfo>(`/github-integration/files/${installationId}`);

export const getRepoContent = async (
  installationId: string,
  fileSlug?: string
) =>
  fetchApi<any[] | null>(
    `/github-integration/files/${installationId}${
      fileSlug ? `?fileSlug=${fileSlug}` : ""
    }`
  ); // TODO: move fileslug to body

export const githubIntegrationService = {
  getGithubIntegration,
  updateGithubIntegration,
  deleteGithubIntegration,
};
