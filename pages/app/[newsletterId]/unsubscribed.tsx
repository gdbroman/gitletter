import { GetServerSideProps, NextPage } from "next/types";
import { NextSeo } from "next-seo";

import prisma from "../../../prisma/prisma";
import { FeedbackFooter } from "../../../src/components/FeedbackFooter";
import Layout from "../../../src/components/Layout";
import { ResultBox } from "./subscribed";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const newsletterId = query.newsletterId as string;

  const newsletter = await prisma.newsletter.findFirst({
    where: { id: newsletterId },
    select: {
      title: true,
    },
  });

  return {
    props: { newsletterTitle: newsletter.title },
  };
};

type Props = {
  newsletterTitle: string;
};

const UnsubscribedPage: NextPage<Props> = ({ newsletterTitle }) => (
  <Layout footer={<FeedbackFooter />}>
    <NextSeo title="Farewell 👋" />
    <ResultBox
      title="Farewell"
      emoji="👋"
      body={`You have been unsubscribed from ${newsletterTitle}`}
    />
  </Layout>
);

export default UnsubscribedPage;
