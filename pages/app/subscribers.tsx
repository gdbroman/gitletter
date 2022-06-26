import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { FC } from "react";

import prisma from "../../prisma/prisma";
import { EnhancedTable } from "../../src/components/EnhancedTable";
import Layout from "../../src/components/Layout";
import { ProtectedPage } from "../../src/components/ProtectedPage";
import { Dashboard } from "../../src/containers/dashboard/Dashboard";
import { removeSubscriber } from "../../src/services/subscribers";
import {
  stripDate,
  SubscriberWithStrippedDate,
} from "../../src/types/stripDate";

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
      subscribers: true,
    },
  });

  return {
    props: { newsletter: stripDate(newsletter) },
  };
};

type Props = {
  newsletter: {
    id: string;
    title: string;
    subscribers: SubscriberWithStrippedDate[];
  };
};

const Subscribers: FC<Props> = ({ newsletter }) => {
  const router = useRouter();

  const title = newsletter.title;
  const newsletterId = newsletter.id;
  const subscribers = newsletter.subscribers;

  const onItemClick = (_: SubscriberWithStrippedDate) => {
    // todo
  };
  const onItemDelete = async (subscriber: SubscriberWithStrippedDate) => {
    await removeSubscriber(subscriber.email, newsletter.id);
    router.replace(`/app/subscribers`);
  };

  return (
    <ProtectedPage>
      <Layout>
        <NextSeo title="Subscribers" />
        <Dashboard title={title} value={2} newsletterId={newsletterId}>
          {subscribers.length > 0 ? (
            <EnhancedTable
              type="subscribers"
              items={subscribers}
              onItemDelete={onItemDelete}
            />
          ) : (
            "Use this to capture email addresses from your newsletter."
          )}
        </Dashboard>
      </Layout>
    </ProtectedPage>
  );
};

export default Subscribers;
