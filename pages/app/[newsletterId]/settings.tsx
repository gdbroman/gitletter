import Box from "@mui/material/Box";
import { GithubIntegration } from "@prisma/client";
import { GetServerSideProps } from "next/types";
import { NextSeo } from "next-seo";
import { FC } from "react";

import {
  getGithubRepos,
  GithubReposInfo,
} from "../../../prisma/modules/github";
import { getProducts, Product } from "../../../prisma/modules/stripe";
import prisma from "../../../prisma/prisma";
import Layout from "../../../src/components/Layout";
import { ProtectedPage } from "../../../src/components/ProtectedPage";
import { Dashboard } from "../../../src/containers/dashboard/Dashboard";
import { GithubIntegrationSettings } from "../../../src/containers/settings/GithubIntegrationSettings";
import { NewsletterSettings } from "../../../src/containers/settings/NewsletterSettings";
import { ProductSettings } from "../../../src/containers/settings/ProductSettings";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const newsletterId = query.newsletterId as string;

  const newsletter = await prisma.newsletter.findUnique({
    where: { id: newsletterId },
    select: {
      title: true,
      author: {
        select: {
          stripeProductId: true,
        },
      },
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

  const products = await getProducts();

  return {
    props: {
      newsletterId,
      newsletterTitle: newsletter.title,
      githubIntegration: newsletter.githubIntegration,
      githubReposInfo,
      stripeProductId: newsletter.author.stripeProductId,
      products,
    },
  };
};

type Props = {
  newsletterId: string;
  newsletterTitle: string;
  githubIntegration?: GithubIntegration;
  githubReposInfo: GithubReposInfo | null;
  stripeProductId: string;
  products: Product[];
};

const AppSettings: FC<Props> = ({
  newsletterId,
  newsletterTitle,
  githubIntegration,
  githubReposInfo,
  stripeProductId,
  products,
}) => (
  <ProtectedPage>
    <Layout>
      <NextSeo title="Settings" />
      <Dashboard title={newsletterTitle} value={3} newsletterId={newsletterId}>
        <Box display="flex" flexDirection="column" gap={2}>
          <GithubIntegrationSettings
            githubIntegration={githubIntegration}
            githubReposInfo={githubReposInfo}
          />
          <NewsletterSettings id={newsletterId} title={newsletterTitle} />
          <ProductSettings
            initialProductId={stripeProductId}
            products={products}
          />
        </Box>
      </Dashboard>
    </Layout>
  </ProtectedPage>
);

export default AppSettings;
