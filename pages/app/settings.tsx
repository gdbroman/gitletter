import GitHubIcon from "@mui/icons-material/GitHub";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { GithubIntegration, Newsletter } from "@prisma/client";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import { getSession } from "next-auth/react";
import { FC, useMemo, useState } from "react";

import { Dashboard } from "../../components/Dashboard/Dashboard";
import { ItemSelect } from "../../components/ItemSelect";
import Layout from "../../components/Layout";
import { ProtectedPage } from "../../components/ProtectedPage";
import { CustomSnackbar } from "../../components/Snackbar";
import {
  deleteIntegration,
  getReposDirs,
  updateIntegration,
} from "../../util/githubClient";
import prisma from "../../util/prisma";
import { GithubReposDirs } from "../api/github/app/[...installationId]";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { drafts: [] } };
  }

  const newsletter = await prisma.newsletter.findFirst({
    where: { author: { email: session.user.email } },
    include: {
      githubIntegration: true,
    },
  });

  let githubReposDirs = null;
  if (newsletter.githubIntegration) {
    try {
      githubReposDirs = await getReposDirs(
        newsletter.githubIntegration.installationId
      );
    } catch (e) {
      console.error(e);
    }
  }

  return {
    props: { newsletter, githubReposDirs },
  };
};

type Props = {
  newsletter: Newsletter & {
    githubIntegration?: GithubIntegration;
  };
  githubReposDirs: GithubReposDirs | null;
};

const AppSettings: FC<Props> = ({ newsletter, githubReposDirs }) => {
  const router = useRouter();

  const title = newsletter?.title;
  const githubIntegration = newsletter?.githubIntegration;
  const githubIntegrationInstallationId =
    newsletter?.githubIntegration?.installationId;

  const [repo, setRepo] = useState<string>(githubIntegration?.repoName ?? "");
  const [dir, setDir] = useState<string>(githubIntegration?.repoDir ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
    [dir, githubIntegration?.repoName, githubIntegration?.repoDir, repo]
  );
  const isValid = useMemo(
    () => isChanged && repo && dir,
    [dir, isChanged, repo]
  );

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await updateIntegration(githubIntegrationInstallationId, {
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
      setIsLoading(false);
    }
  };
  const handleCancelEdit = () => {
    setRepo(githubIntegration?.repoName ?? "");
    setDir(githubIntegration?.repoDir ?? "");
  };
  const handleCloseConnection = async () => {
    try {
      await deleteIntegration(githubIntegrationInstallationId);
    } catch (e) {
      setError(
        "Failed to disconnect from GitHub. Please refresh the page and try again."
      );
    } finally {
      router.replace(router.asPath);
      setSuccess("GitHub integration disconnected successfully!");
    }
  };

  return (
    <ProtectedPage>
      <Layout>
        <Dashboard title={title} value={2}>
          <Card variant="outlined">
            {githubIntegration ? (
              <Alert
                severity="success"
                onClose={handleCloseConnection}
                closeText={"Disconnect from GitHub"}
              >
                Connected to GitHub!
              </Alert>
            ) : (
              <Alert severity="info" icon={<GitHubIcon />}>
                GitHub integration
              </Alert>
            )}
            <Box
              display="flex"
              flexDirection="column"
              gap={3}
              padding={2}
              paddingTop={4}
            >
              {githubIntegration && (
                <>
                  <ItemSelect
                    label="Repository"
                    items={repos}
                    value={repo}
                    onChange={setRepo}
                    helperText="Select a repository."
                    disabled={isLoading}
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
                        disabled={isLoading}
                      />
                    </Box>
                  )}
                </>
              )}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="caption" color="gray">
                  {githubIntegration ? (
                    <>
                      Can't find your repository?{" "}
                      <a
                        href={process.env.GITHUB_APP_URL}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Add it
                      </a>{" "}
                      to your installation configuration.
                    </>
                  ) : (
                    "This is necessary for the app to work (takes ~1 minute)"
                  )}
                </Typography>
                <Box display="flex" columnGap={1}>
                  {githubIntegration ? (
                    <>
                      {isChanged && (
                        <Button
                          color="primary"
                          variant="text"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                      )}
                      <LoadingButton
                        variant={isValid ? "contained" : "outlined"}
                        disabled={!isValid}
                        loading={isLoading}
                        onClick={handleSave}
                      >
                        Save
                      </LoadingButton>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      href={process.env.GITHUB_APP_URL}
                    >
                      Connect your repo
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          </Card>
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
        </Dashboard>
      </Layout>
    </ProtectedPage>
  );
};

export default AppSettings;
