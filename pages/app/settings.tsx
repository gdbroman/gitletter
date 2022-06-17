import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { GithubIntegration, Newsletter } from "@prisma/client";
import { GetServerSideProps } from "next/types";
import { getSession } from "next-auth/react";
import { FC, useMemo } from "react";

import { Dashboard } from "../../components/Dashboard/Dashboard";
import { ItemSelect } from "../../components/ItemSelect";
import Layout from "../../components/Layout";
import { ProtectedPage } from "../../components/ProtectedPage";
import { getRepos } from "../../util/githubClient";
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
  const { title, githubIntegration } = newsletter;
  const repos = useMemo(
    () => githubRepos.map((repo) => repo.name),
    [githubRepos]
  );

  return (
    <ProtectedPage>
      <Layout>
        <Dashboard title={title} value={2}>
          {githubIntegration?.installationId ? (
            <>
              <ItemSelect items={repos} label="Repository" />
              <Typography variant="body2" color="GrayText">
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
        </Dashboard>
      </Layout>
    </ProtectedPage>
  );
};

export default AppSettings;
