import type { GithubIntegration } from "@prisma/client";

import type { GithubReposInfo } from "../../prisma/modules/github";
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
  repoName: string,
  repoDir: string,
  repoOwner: string
) =>
  fetchApi<GithubIntegration>(`/github-integration/${installationId}`, "PUT", {
    repoName,
    repoDir,
    repoOwner,
  });

// Not using these atm
export const getReposInfo = async (installationId: string) =>
  fetchApi<GithubReposInfo>(`/github-integration/files/${installationId}`);

export const githubIntegrationService = {
  getGithubIntegration,
  updateGithubIntegration,
  deleteGithubIntegration,
};
