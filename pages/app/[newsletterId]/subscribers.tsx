import { useRouter } from "next/router";
import type { GetServerSideProps, NextPage } from "next/types";
import { NextSeo } from "next-seo";
import { useCallback } from "react";

import prisma from "../../../prisma/prisma";
import { EmptyTab } from "../../../src/components/EmptyTab";
import { EnhancedTable } from "../../../src/components/EnhancedTable";
import Layout from "../../../src/components/Layout";
import { ProtectedPage } from "../../../src/components/ProtectedPage";
import { Dashboard } from "../../../src/containers/dashboard/Dashboard";
import { subscriberService } from "../../../src/services/subscriberService";
import type { SubscriberWithStrippedDate } from "../../../src/types/stripDate";
import { stripDate } from "../../../src/types/stripDate";
import { useAppHref } from "../../../util/hooks/useAppHref";

type Props = {
  newsletterTitle: string;
  subscribers: SubscriberWithStrippedDate[];
};

const emptyServerProps: Props = {
  newsletterTitle: "",
  subscribers: [],
};

export const getServerSideProps: GetServerSideProps = async ({
  res,
  query,
}) => {
  const newsletterId = query.newsletterId as string;
  if (!newsletterId) {
    res.statusCode = 401;
    res.setHeader("location", "/404");
    return { props: emptyServerProps };
  }

  const newsletter = await prisma.newsletter.findUnique({
    where: { id: newsletterId },
    select: {
      id: true,
      title: true,
      subscribers: true,
    },
  });

  if (!newsletter) {
    res.statusCode = 302;
    res.setHeader("location", "/404");
    return { props: emptyServerProps };
  }

  return {
    props: {
      newsletterTitle: newsletter.title,
      subscribers: newsletter.subscribers.map(stripDate),
    },
  };
};

const SubscribersPage: NextPage<Props> = ({ newsletterTitle, subscribers }) => {
  const router = useRouter();
  const appHref = useAppHref();

  const onItemDelete = useCallback(
    async (subscriber: SubscriberWithStrippedDate) => {
      await subscriberService.deleteSubscriber(subscriber.id);
      router.replace(`${appHref}/subscribers`);
    },
    [appHref, router]
  );

  return (
    <ProtectedPage>
      <Layout headerTitle={newsletterTitle}>
        <NextSeo title={`Subscribers – ${newsletterTitle}`} />
        <Dashboard>
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

export default SubscribersPage;
