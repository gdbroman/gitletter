import { GithubIntegration } from "@prisma/client";
import { GetServerSideProps } from "next/types";
import { NextSeo } from "next-seo";
import { FC } from "react";

import { GithubReposInfo } from "../../../../prisma/modules/github";
import { getProducts, Product } from "../../../../prisma/modules/stripe";
import prisma from "../../../../prisma/prisma";
import Layout from "../../../../src/components/Layout";
import { ProtectedPage } from "../../../../src/components/ProtectedPage";
import { Dashboard } from "../../../../src/containers/dashboard/Dashboard";
import { ProductSettings } from "../../../../src/containers/settings/ProductSettings";
import { SettingsContentWrapper } from "../../../../src/containers/settings/SettingsContentWrapper";

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
    },
  });

  const products = await getProducts();

  return {
    props: {
      newsletterId,
      newsletterTitle: newsletter.title,
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
  newsletterTitle,
  stripeProductId,
  products,
}) => (
  <ProtectedPage>
    <Layout headerTitle={newsletterTitle}>
      <NextSeo title={`Billing Settings – ${newsletterTitle}`} />
      <Dashboard>
        <SettingsContentWrapper>
          <ProductSettings
            initialProductId={stripeProductId}
            products={products}
          />
        </SettingsContentWrapper>
      </Dashboard>
    </Layout>
  </ProtectedPage>
);

export default AppSettings;
