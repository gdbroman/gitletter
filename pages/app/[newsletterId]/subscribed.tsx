import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { GetServerSideProps, NextPage } from "next/types";
import { NextSeo } from "next-seo";
import type { FC } from "react";

import prisma from "../../../prisma/prisma";
import { FeedbackFooter } from "../../../src/components/FeedbackFooter";
import Layout from "../../../src/components/Layout";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const newsletterId = query.newsletterId as string;

  const newsletter = await prisma.newsletter.findFirst({
    where: { id: newsletterId },
    select: {
      title: true,
    },
  });

  if (!newsletter) {
    return {
      props: {},
    };
  }

  return {
    props: { newsletterTitle: newsletter.title },
  };
};

type ResultBoxProps = {
  title: string;
  emoji: string;
  body: string;
};

export const ResultBox: FC<ResultBoxProps> = ({ title, emoji, body }) => (
  <Box my={8} mx="auto" textAlign="center" maxWidth="500px">
    <Typography variant="h1" fontWeight="bold">
      {`${title} `}
      <span role="img" aria-label="emoji">
        {emoji}
      </span>
    </Typography>
    <Typography
      variant="body1"
      fontWeight="medium"
      mt={3}
      mb={4}
      style={{
        fontSize: "2rem",
      }}
    >
      {body}
    </Typography>
  </Box>
);

type Props = {
  newsletterTitle: string;
};

const SubscribedPage: NextPage<Props> = ({ newsletterTitle }) => (
  <Layout footer={<FeedbackFooter />}>
    <NextSeo title="Success! 🎉" />
    <ResultBox
      title="Success!"
      emoji="🎉"
      body={`You have successfully subscribed to ${newsletterTitle}`}
    />
  </Layout>
);

export default SubscribedPage;
