import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { GithubIntegration, Newsletter } from "@prisma/client";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import { getSession } from "next-auth/react";
import { FC, useMemo } from "react";

import { Dashboard } from "../../components/Dashboard/Dashboard";
import { ItemSelect } from "../../components/ItemSelect";
import Layout from "../../components/Layout";
import { ProtectedPage } from "../../components/ProtectedPage";
import { deleteIntegration, getRepos } from "../../util/githubClient";
import prisma from "../../util/prisma";

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

  let repos = [];
  if (newsletter.githubIntegration) {
    try {
      const reposRes = await getRepos(
        newsletter.githubIntegration.installationId
      );
      repos = await reposRes.json();
    } catch (e) {
      console.error(e);
    }
  }

  return {
    props: { newsletter, githubRepos: repos },
  };
};

type Props = {
  newsletter: Newsletter & {
    githubIntegration?: GithubIntegration;
  };
  githubRepos: any[];
};

const AppSettings: FC<Props> = ({ newsletter, githubRepos }) => {
  const router = useRouter();

  const title = newsletter?.title;
  const githubIntegration = newsletter?.githubIntegration;
  const githubIntegrationInstallationId = useMemo(
    () => githubIntegration?.installationId,
    [githubIntegration?.installationId]
  );
  const repos = useMemo(
    () => githubRepos.map((repo) => repo.name),
    [githubRepos]
  );

  const handleCloseConnection = async () => {
    await deleteIntegration(githubIntegrationInstallationId);
    router.replace(router.asPath); // refresh props!
  };

  return (
    <ProtectedPage>
      <Layout>
        <Dashboard title={title} value={2}>
          {githubIntegrationInstallationId ? (
            <Box display="flex" flexDirection="column" gap={4}>
              <Alert severity="success" onClose={handleCloseConnection}>
                Connected to GitHub!
              </Alert>
              <Box>
                <ItemSelect items={repos} label="Repository" />
                <Typography variant="body2" color="GrayText" mt={2}>
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
              </Box>
            </Box>
          ) : (
            <Button
              variant="contained"
              color="primary"
              href={process.env.GITHUB_APP_URL}
            >
              Connect your repo
            </Button>
          )}
        </Dashboard>
      </Layout>
    </ProtectedPage>
  );
};

export default AppSettings;
