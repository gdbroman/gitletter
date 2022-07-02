import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { GetServerSideProps } from "next/types";
import { FC } from "react";

import prisma from "../../../prisma/prisma";
import Layout from "../../../src/components/Layout";

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

const UnsubscribedPage: FC<Props> = ({ newsletterTitle }) => (
  <Layout>
    <Box my={8} mx="auto" textAlign="center" maxWidth="600px">
      <Typography variant="h1" fontWeight="bold">
        Farewell 👋
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
        You have been unsubscribed from {newsletterTitle}
      </Typography>
    </Box>
  </Layout>
);

export default UnsubscribedPage;
