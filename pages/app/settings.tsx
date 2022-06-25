import { GithubIntegration, Newsletter } from "@prisma/client";
import { GetServerSideProps } from "next/types";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { FC } from "react";

import Layout from "../../src/components/Layout";
import { ProtectedPage } from "../../src/components/ProtectedPage";
import { Dashboard } from "../../src/containers/dashboard/Dashboard";
import { GithubIntegrationSettings } from "../../src/containers/settings/GithubIntegrationCard";
import prisma from "../../src/prisma/prisma";
import { getReposInfo } from "../../src/util/githubClient";
import { GithubReposInfo } from "../api/github/app/[...installationId]";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { newsletter: {}, githubReposDirs: {} } };
  }

  const newsletter = await prisma.newsletter.findFirst({
    where: { author: { email: session.user.email } },
    include: {
      githubIntegration: true,
    },
  });

  let githubReposInfo = null;
  if (newsletter.githubIntegration) {
    try {
      githubReposInfo = await getReposInfo(
        newsletter.githubIntegration.installationId
      );
    } catch (e) {
      console.error(e);
    }
  }

  return {
    props: { newsletter, githubReposInfo },
  };
};

type Props = {
  newsletter: Newsletter & {
    githubIntegration?: GithubIntegration;
  };
  githubReposInfo: GithubReposInfo | null;
};

const AppSettings: FC<Props> = ({ newsletter, githubReposInfo }) => {
  const title = newsletter?.title;
  const githubIntegration = newsletter?.githubIntegration;
  const newsletterId = newsletter.id;

  return (
    <ProtectedPage>
      <Layout>
        <NextSeo title="Settings" />
        <Dashboard title={title} value={3} newsletterId={newsletterId}>
          <GithubIntegrationSettings
            githubIntegration={githubIntegration}
            githubReposInfo={githubReposInfo}
          />
        </Dashboard>
      </Layout>
    </ProtectedPage>
  );
};

export default AppSettings;
