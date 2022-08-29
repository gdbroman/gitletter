import { GithubIntegration } from "@prisma/client";
import { GetServerSideProps } from "next/types";
import { NextSeo } from "next-seo";
import { FC } from "react";

import {
  getGithubRepos,
  GithubReposInfo,
} from "../../../../prisma/modules/github";
import prisma from "../../../../prisma/prisma";
import Layout from "../../../../src/components/Layout";
import { ProtectedPage } from "../../../../src/components/ProtectedPage";
import { Dashboard } from "../../../../src/containers/dashboard/Dashboard";
import { GithubIntegrationSettings } from "../../../../src/containers/settings/GithubIntegrationSettings";
import { SettingsContentWrapper } from "../../../../src/containers/settings/SettingsContentWrapper";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const newsletterId = query.newsletterId as string;

  const newsletter = await prisma.newsletter.findUnique({
    where: { id: newsletterId },
    select: {
      title: true,
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
    props: {
      newsletterTitle: newsletter.title,
      githubIntegration: newsletter.githubIntegration,
      githubReposInfo,
    },
  };
};

type Props = {
  newsletterTitle: string;
  githubIntegration?: GithubIntegration;
  githubReposInfo: GithubReposInfo | null;
};

const AppSettings: FC<Props> = ({
  newsletterTitle,
  githubIntegration,
  githubReposInfo,
}) => (
  <ProtectedPage>
    <Layout headerTitle={newsletterTitle}>
      <NextSeo title={`GitHub Settings – ${newsletterTitle}`} />
      <Dashboard>
        <SettingsContentWrapper>
          <GithubIntegrationSettings
            githubIntegration={githubIntegration}
            githubReposInfo={githubReposInfo}
          />
        </SettingsContentWrapper>
      </Dashboard>
    </Layout>
  </ProtectedPage>
);

export default AppSettings;
