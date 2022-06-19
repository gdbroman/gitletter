import { GithubIntegration, Newsletter } from "@prisma/client";
import { GetServerSideProps } from "next/types";
import { getSession } from "next-auth/react";
import { FC } from "react";

import { Dashboard } from "../../components/Dashboard/Dashboard";
import Layout from "../../components/Layout";
import { ProtectedPage } from "../../components/ProtectedPage";
import { GithubIntegrationSettings } from "../../components/settings/GithubIntegrationCard";
import { getReposDirs } from "../../util/githubClient";
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
  const title = newsletter?.title;
  const githubIntegration = newsletter?.githubIntegration;

  return (
    <ProtectedPage>
      <Layout>
        <Dashboard title={title} value={2}>
          <GithubIntegrationSettings
            githubIntegration={githubIntegration}
            githubReposDirs={githubReposDirs}
          />
        </Dashboard>
      </Layout>
    </ProtectedPage>
  );
};

export default AppSettings;
