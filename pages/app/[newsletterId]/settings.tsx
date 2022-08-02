import Box from "@mui/material/Box";
import { GithubIntegration, Newsletter } from "@prisma/client";
import { GetServerSideProps } from "next/types";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { FC } from "react";

import {
  getGithubRepos,
  GithubReposInfo,
} from "../../../prisma/modules/github";
import prisma from "../../../prisma/prisma";
import Layout from "../../../src/components/Layout";
import { ProtectedPage } from "../../../src/components/ProtectedPage";
import { Dashboard } from "../../../src/containers/dashboard/Dashboard";
import { GithubIntegrationSettings } from "../../../src/containers/settings/GithubIntegrationSettings";
import { NewsletterSettings } from "../../../src/containers/settings/NewsletterSettings";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 401;
    return { props: { newsletter: {}, githubReposInfo: {} } };
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
      githubReposInfo = await getGithubRepos(
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
          <Box display="flex" flexDirection="column" gap={2}>
            <GithubIntegrationSettings
              githubIntegration={githubIntegration}
              githubReposInfo={githubReposInfo}
            />
            <NewsletterSettings id={newsletterId} title={title} />
          </Box>
        </Dashboard>
      </Layout>
    </ProtectedPage>
  );
};

export default AppSettings;
