import type { GithubIntegration } from "@prisma/client";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

import type {
  GithubReposInfo,
  RepoInfo,
} from "../../../../prisma/modules/github";
import { useToggle } from "../../../../util/hooks/useToggle";
import { githubIntegrationService } from "../../../services/githubIntegrationService";
import type { Nullable } from "../../../types/general";
import { GithubIntegrationConnectionCard } from "./GithubIntegrationConnectionCard";
import { GithubIntegrationSettingsCard } from "./GithubIntegrationSettingsCard";

type Props = {
  githubIntegration: GithubIntegration | undefined;
  githubReposInfo: GithubReposInfo;
};

export const GithubIntegrationSettings = ({
  githubIntegration,
  githubReposInfo,
}: Nullable<Props>) => {
  const router = useRouter();

  const initialValues = useMemo(
    () => ({
      repo: githubIntegration?.repoName ?? "",
      dir: githubIntegration?.repoDir ?? "",
    }),
    [githubIntegration]
  );
  const [repo, setRepo] = useState<string>(initialValues.repo);
  const [dir, setDir] = useState<string>(initialValues.dir);

  const githubReposData: Map<string, RepoInfo[]> = useMemo(
    () => new Map(githubReposInfo),
    [githubReposInfo]
  );
  const repos = useMemo(
    () => Array.from(githubReposData?.keys() ?? []),
    [githubReposData]
  );
  const dirs = useMemo(
    () => githubReposData?.get(repo)?.map((d) => d.dir) ?? [],
    [githubReposData, repo]
  );
  const isChanged = useMemo(
    () => repo !== initialValues.repo || dir !== initialValues.dir,
    [dir, repo, initialValues.dir, initialValues.repo]
  );
  const isValid = useMemo(
    () => isChanged && repo !== "" && dir !== "",
    [dir, isChanged, repo]
  );

  const submitting = useToggle(false);
  const disconnecting = useToggle(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSetRepo = (repo: string) => {
    setRepo(repo);
    setDir("");
  };
  const handleSave = async () => {
    submitting.toggleOn();
    setError(null);
    setSuccess(null);
    const installationId = githubIntegration?.installationId;
    const repoData = githubReposData.get(repo);
    if (!installationId || !repoData) return;
    try {
      const res = await githubIntegrationService.updateGithubIntegration(
        installationId,
        repo,
        dir,
        repoData[0]?.owner
      );
      if (res == null) {
        throw new Error("No response");
      }
    } catch (e) {
      setError(
        "Failed to update GitHub integration. Please refresh the page and try again."
      );
    } finally {
      router.replace(router.asPath);
      setSuccess("GitHub integration updated successfully!");
      submitting.toggleOff();
    }
  };
  const handleCancelEdit = () => {
    setRepo(githubIntegration?.repoName ?? "");
    setDir(githubIntegration?.repoDir ?? "");
  };
  const handleDisconnect = async () => {
    disconnecting.toggleOn();
    const installationId = githubIntegration?.installationId;
    if (!installationId) return;
    try {
      const res = await githubIntegrationService.deleteGithubIntegration(
        installationId
      );
      if (res == null) {
        throw new Error("No response");
      }
    } catch (e) {
      setError(
        "Failed to disconnect from GitHub. Please refresh the page and try again."
      );
      disconnecting.toggleOff();
    } finally {
      router.replace(router.asPath);
      setSuccess("GitHub integration disconnected successfully!");
    }
  };

  if (!!githubIntegration && !!githubReposData) {
    return (
      <GithubIntegrationSettingsCard
        repo={repo}
        repos={repos}
        dir={dir}
        dirs={dirs}
        isValid={isValid}
        isChanged={isChanged}
        submitting={submitting.isOn}
        disconnecting={disconnecting.isOn}
        error={error}
        success={success}
        setRepo={handleSetRepo}
        setDir={setDir}
        setError={setError}
        setSuccess={setSuccess}
        handleSave={handleSave}
        handleCancelEdit={handleCancelEdit}
        handleDisconnect={handleDisconnect}
      />
    );
  }

  return <GithubIntegrationConnectionCard />;
};
