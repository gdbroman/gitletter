import { GetServerSideProps } from "next/types";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { FC } from "react";

import prisma from "../../prisma/prisma";
import Layout from "../../src/components/Layout";
import { ProtectedPage } from "../../src/components/ProtectedPage";
import { Dashboard } from "../../src/containers/dashboard/Dashboard";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { newsletter: {} } };
  }

  const newsletter = await prisma.newsletter.findFirst({
    where: { author: { email: session.user.email } },
    select: {
      id: true,
      title: true,
    },
  });

  return {
    props: { newsletter },
  };
};

type Props = {
  newsletter: {
    id: string;
    title: string;
  };
};

const Subscribers: FC<Props> = ({ newsletter }) => {
  const title = newsletter.title;
  const newsletterId = newsletter.id;

  return (
    <ProtectedPage>
      <Layout>
        <NextSeo title="Subscribers" />
        <Dashboard title={title} value={2} newsletterId={newsletterId}>
          Use this to capture email addresses from your newsletter.
        </Dashboard>
      </Layout>
    </ProtectedPage>
  );
};

export default Subscribers;
