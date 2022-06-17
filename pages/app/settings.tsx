import Button from "@mui/material/Button";
import { GithubIntegration, Issue, Newsletter } from "@prisma/client";
import { GetServerSideProps } from "next/types";
import { getSession } from "next-auth/react";
import { FC } from "react";

import { Dashboard } from "../../components/Dashboard/Dashboard";
import { Dropdown } from "../../components/Dropdown";
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
      issues: true,
    },
  });

  const reposRes = await getRepos(newsletter.githubIntegration.installationId);
  const repos = await reposRes.json();

  return {
    props: { newsletter, githubRepos: repos },
  };
};

type Props = {
  newsletter: Newsletter & {
    githubIntegration?: GithubIntegration;
    issues: Issue[];
  };
  githubRepos: any[];
};

const Home: FC<Props> = ({ newsletter, githubRepos }) => {
  const { title, githubIntegration, issues } = newsletter;

  return (
    <ProtectedPage>
      <Layout>
        <Dashboard title={title} value={2}>
          {githubIntegration?.installationId ? (
            <>
              <Dropdown />
              <Button
                variant="contained"
                color="warning"
                onClick={() =>
                  deleteIntegration(githubIntegration?.installationId)
                }
              >
                Disconnect
              </Button>
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

export default Home;
