import styled from "@emotion/styled";
import GitHubIcon from "@mui/icons-material/GitHub";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
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
import { LoadingButtonWithBlackSpinner } from "../Header/HeaderNavRight";

const StyledAlert = styled(Alert)`
  .MuiAlert-message {
    width: 100%;
  }
  .MuiAlert-icon {
    display: none;
  }
`;

type Props = {
  githubIntegration: GithubIntegration;
  githubReposDirs: GithubReposDirs;
};

export const GithubIntegrationSettings: FC<Nullable<Props>> = ({
  githubIntegration,
  githubReposDirs,
}) => {
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
  const handleDisconnect = async () => {
    disconnecting.toggleOn();
    try {
      await deleteIntegration(githubIntegration?.installationId);
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
        handleDisconnect={handleDisconnect}
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
  handleDisconnect: () => void;
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
  handleDisconnect,
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
        onClose={handleDisconnect}
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
            {submitting && (
              <LoadingButton variant="contained" loading>
                Save
              </LoadingButton>
            )}
            {disconnecting && (
              <LoadingButtonWithBlackSpinner variant="outlined" loading>
                Save
              </LoadingButtonWithBlackSpinner>
            )}
            {!(submitting || disconnecting) && (
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
    <StyledAlert
      severity="info"
      style={{ display: "flex", alignItems: "center" }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding={1}
      >
        <Box>
          <AlertTitle style={{ margin: 0 }}>
            GitHub integration required
          </AlertTitle>
          Setup takes less than a minute
        </Box>
        <Button
          variant="contained"
          size="medium"
          color="primary"
          href={process.env.GITHUB_APP_URL}
          startIcon={<GitHubIcon />}
        >
          Connect your repo
        </Button>
      </Box>
    </StyledAlert>
  </Card>
);
