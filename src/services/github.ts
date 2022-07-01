import { GithubIntegration } from "@prisma/client";

import {
  GithubReposInfo,
  UpdateGithubIntegrationInput,
} from "../../pages/api/github/app/[...installationId]";
import { fetchApi } from "../util/fetchApi";

export const getIntegration = async (newsletterId: string) =>
  fetchApi<GithubIntegration>(`/github/integration/${newsletterId}`);

export const deleteIntegration = async (githubInstallationId: string) =>
  fetchApi<GithubIntegration>(`/github/app/${githubInstallationId}`, "DELETE");

export const updateIntegration = async (
  githubInstallationId: string,
  updateGithubIntegrationInput: UpdateGithubIntegrationInput
) =>
  fetchApi<GithubIntegration>(
    `/github/app/${githubInstallationId}`,
    "PUT",
    updateGithubIntegrationInput
  );

// Not using these atm
export const getReposInfo = async (githubInstallationId: string) =>
  fetchApi<GithubReposInfo>(`/github/app/${githubInstallationId}`);

export const getRepoContent = async (
  githubInstallationId: string,
  fileSlug?: string
) =>
  fetchApi<any[] | null>(
    `/github/${githubInstallationId}${fileSlug ? `?fileSlug=${fileSlug}` : ""}`
  ); // TODO: move fileslug to body
