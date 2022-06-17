import { GithubIntegration, Issue, Newsletter } from "@prisma/client";
import { GetServerSideProps } from "next/types";
import { getSession } from "next-auth/react";
import { FC } from "react";

import { Dashboard } from "../../components/Dashboard/Dashboard";
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

const AppCapture: FC<Props> = ({ newsletter, githubRepos }) => {
  const { title, githubIntegration, issues } = newsletter;

  return (
    <ProtectedPage>
      <Layout>
        <Dashboard title={title} value={1}>
          Use this to capture email addresses from your newsletter.
        </Dashboard>
      </Layout>
    </ProtectedPage>
  );
};

export default AppCapture;
