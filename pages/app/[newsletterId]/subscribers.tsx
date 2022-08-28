import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import { NextSeo } from "next-seo";
import { FC, useCallback } from "react";

import prisma from "../../../prisma/prisma";
import { EmptyTab } from "../../../src/components/EmptyTab";
import { EnhancedTable } from "../../../src/components/EnhancedTable";
import Layout from "../../../src/components/Layout";
import { ProtectedPage } from "../../../src/components/ProtectedPage";
import { Dashboard } from "../../../src/containers/dashboard/Dashboard";
import { subscriberService } from "../../../src/services/subscriberService";
import {
  stripDate,
  SubscriberWithStrippedDate,
} from "../../../src/types/stripDate";
import { useAppHref } from "../../../util/hooks/useAppHref";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const newsletterId = query.newsletterId as string;

  const newsletter = await prisma.newsletter.findUnique({
    where: { id: newsletterId },
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
  const appHref = useAppHref();

  const title = newsletter.title;
  const subscribers = newsletter.subscribers;

  const onItemDelete = useCallback(
    async (subscriber: SubscriberWithStrippedDate) => {
      await subscriberService.deleteSubscriber(subscriber.id);
      router.replace(`${appHref}/subscribers`);
    },
    [appHref, router]
  );

  return (
    <ProtectedPage>
      <Layout>
        <NextSeo title="Subscribers" />
        <Dashboard title={title} value={2}>
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
