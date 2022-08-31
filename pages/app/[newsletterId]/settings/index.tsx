import { GetServerSideProps, NextPage } from "next/types";
import { NextSeo } from "next-seo";

import prisma from "../../../../prisma/prisma";
import Layout from "../../../../src/components/Layout";
import { ProtectedPage } from "../../../../src/components/ProtectedPage";
import { Dashboard } from "../../../../src/containers/dashboard/Dashboard";
import { NewsletterSettings } from "../../../../src/containers/settings/NewsletterSettings";
import { SettingsContentWrapper } from "../../../../src/containers/settings/SettingsContentWrapper";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const newsletterId = query.newsletterId as string;

  const newsletter = await prisma.newsletter.findUnique({
    where: { id: newsletterId },
    select: {
      title: true,
    },
  });

  return {
    props: {
      newsletterId,
      newsletterTitle: newsletter.title,
    },
  };
};

type Props = {
  newsletterId: string;
  newsletterTitle: string;
};

const NewsletterSettingsPage: NextPage<Props> = ({
  newsletterId,
  newsletterTitle,
}) => (
  <ProtectedPage>
    <Layout headerTitle={newsletterTitle}>
      <NextSeo title={`General Settings – ${newsletterTitle}`} />
      <Dashboard>
        <SettingsContentWrapper>
          <NewsletterSettings id={newsletterId} title={newsletterTitle} />
        </SettingsContentWrapper>
      </Dashboard>
    </Layout>
  </ProtectedPage>
);

export default NewsletterSettingsPage;
