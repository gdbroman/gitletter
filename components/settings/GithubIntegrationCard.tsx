import GitHubIcon from "@mui/icons-material/GitHub";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { GithubIntegration } from "@prisma/client";
import { useRouter } from "next/router";
import { FC, useMemo, useState } from "react";

import { ItemSelect } from "../../components/ItemSelect";
import { CustomSnackbar } from "../../components/Snackbar";
import { GithubReposDirs } from "../../pages/api/github/app/[...installationId]";
import { deleteIntegration, updateIntegration } from "../../util/githubClient";
import { useToggle } from "../../util/hooks";
import { Nullable } from "../../util/types";

type Props = {
  githubIntegration: GithubIntegration;
  githubReposDirs: GithubReposDirs;
};

export const GithubIntegrationSettings: FC<Nullable<Props>> = ({
  githubIntegration,
  githubReposDirs,
}) => {
  const router = useRouter();

  const [repo, setRepo] = useState<string>(githubIntegration?.repoName ?? "");
  const [dir, setDir] = useState<string>(githubIntegration?.repoDir ?? "");

  const githubReposData: Map<string, string[]> = useMemo(
    () => new Map(githubReposDirs),
    [githubReposDirs]
  );
  const repos = useMemo(
    () => Array.from(githubReposData?.keys() ?? []),
    [githubReposData]
  );
  const dirs = useMemo(
    () => [...(githubReposData?.get(repo) ?? []), "./"],
    [githubReposData, repo]
  );
  const isChanged = useMemo(
    () =>
      repo !== githubIntegration?.repoName ||
      dir !== githubIntegration?.repoDir,
    [repo, dir, githubIntegration?.repoName, githubIntegration?.repoDir]
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
    try {
      await updateIntegration(githubIntegration?.installationId, {
        repoName: repo,
        repoDir: dir,
      });
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
  const handleCloseConnection = async () => {
    disconnecting.toggleOn();
    try {
      await deleteIntegration(githubIntegration?.installationId);
    } catch (e) {
      setError(
        "Failed to disconnect from GitHub. Please refresh the page and try again."
      );
    } finally {
      router.replace(router.asPath);
      setSuccess("GitHub integration disconnected successfully!");
      disconnecting.toggleOff();
    }
  };

  if (!!githubIntegration && !!githubReposDirs) {
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
        handleCloseConnection={handleCloseConnection}
      />
    );
  }
  return <GithubIntegrationConnectionCard />;
};

type GithubIntegrationSettingsCardProps = {
  repo: string;
  repos: string[];
  dir: string;
  dirs: string[];
  isValid: boolean;
  isChanged: boolean;
  submitting: boolean;
  disconnecting: boolean;
  error: string | null;
  success: string | null;
  setRepo: (repo: string) => void;
  setDir: (dir: string) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
  handleSave: () => void;
  handleCancelEdit: () => void;
  handleCloseConnection: () => void;
};

const GithubIntegrationSettingsCard: FC<GithubIntegrationSettingsCardProps> = ({
  repo,
  repos,
  dir,
  dirs,
  isValid,
  isChanged,
  submitting,
  disconnecting,
  error,
  success,
  setRepo,
  setDir,
  setError,
  setSuccess,
  handleSave,
  handleCancelEdit,
  handleCloseConnection,
}) => (
  <>
    <CustomSnackbar
      message={success}
      severity="success"
      isOpen={!!success}
      onClose={() => setSuccess(null)}
    />
    <CustomSnackbar
      message={error}
      severity="error"
      autoHideDuration={6000}
      isOpen={!!error}
      onClose={() => setError(null)}
    />
    <Card variant="outlined">
      <Alert
        severity="success"
        onClose={handleCloseConnection}
        closeText={"Disconnect from GitHub"}
      >
        Connected to GitHub!
      </Alert>
      <Box
        display="flex"
        flexDirection="column"
        gap={3}
        padding={2}
        paddingTop={4}
      >
        <ItemSelect
          label="Repository"
          items={repos}
          value={repo}
          onChange={setRepo}
          helperText="Select a repository."
          disabled={submitting || disconnecting}
          required
        />
        {repo && (
          <Box marginBottom={1}>
            <ItemSelect
              label="Directory"
              items={dirs}
              value={dir}
              onChange={setDir}
              helperText={
                "Select the directory where issues are stored in your repository."
              }
              disabled={submitting || disconnecting}
              required
            />
          </Box>
        )}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" color="gray">
            Can't find your repository?{" "}
            <a
              href={process.env.GITHUB_APP_URL}
              target="_blank"
              rel="noreferrer"
            >
              Add it
            </a>{" "}
            to your installation configuration.
          </Typography>
          <Box display="flex" columnGap={1}>
            {submitting || disconnecting ? (
              <LoadingButton
                variant={submitting ? "contained" : "outlined"}
                loading
              >
                Save
              </LoadingButton>
            ) : (
              <>
                {isChanged && !success && (
                  <Button
                    color="primary"
                    variant="text"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  variant={!isValid || !!success ? "outlined" : "contained"}
                  disabled={!isValid || !!success}
                  onClick={handleSave}
                >
                  Save
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Card>
  </>
);

const GithubIntegrationConnectionCard: FC = () => (
  <Card variant="outlined">
    <Alert severity="info" icon={<GitHubIcon />}>
      GitHub integration
    </Alert>
    <Box
      display="flex"
      flexDirection="column"
      gap={3}
      padding={2}
      paddingTop={4}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="caption" color="gray">
          Setup takes less than a minute
        </Typography>
        <Box display="flex" columnGap={1}>
          <Button
            variant="contained"
            color="primary"
            href={process.env.GITHUB_APP_URL}
          >
            Connect your repo
          </Button>
        </Box>
      </Box>
    </Box>
  </Card>
);
