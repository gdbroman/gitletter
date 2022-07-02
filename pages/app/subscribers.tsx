import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { FC } from "react";

import prisma from "../../prisma/prisma";
import { EmptyTab } from "../../src/components/EmptyTab";
import { EnhancedTable } from "../../src/components/EnhancedTable";
import Layout from "../../src/components/Layout";
import { ProtectedPage } from "../../src/components/ProtectedPage";
import { Dashboard } from "../../src/containers/dashboard/Dashboard";
import { subscriberService } from "../../src/services/subscriberService";
import {
  stripDate,
  SubscriberWithStrippedDate,
} from "../../src/types/stripDate";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 401;
    return { props: { newsletter: { subscribers: [] } } };
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

  const onItemDelete = async (subscriber: SubscriberWithStrippedDate) => {
    await subscriberService.deleteSubscriber(subscriber.id);
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
            <EmptyTab
              emoji="🕊"
              title="No subscribers yet"
              subtitle={
                <>
                  Click <b>Manage</b> to get going
                </>
              }
            />
          )}
        </Dashboard>
      </Layout>
    </ProtectedPage>
  );
};

export default Subscribers;
