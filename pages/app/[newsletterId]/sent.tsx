import { useRouter } from "next/router";
import type { GetServerSideProps, NextPage } from "next/types";
import { NextSeo } from "next-seo";

import prisma from "../../../prisma/prisma";
import { EmptyTab } from "../../../src/components/EmptyTab";
import { EnhancedTable } from "../../../src/components/EnhancedTable";
import Layout from "../../../src/components/Layout";
import { ProtectedPage } from "../../../src/components/ProtectedPage";
import { Dashboard } from "../../../src/containers/dashboard/Dashboard";
import { issueService } from "../../../src/services/issueService";
import type { IssueWithParsedTitleAndStrippedDate } from "../../../src/types/stripDate";
import { stripDate } from "../../../src/types/stripDate";
import { useAppHref } from "../../../util/hooks/useAppHref";
import { getTitleFromContent } from "../../../util/strings";

type Props = {
  newsletterId: string;
  newsletterTitle: string;
  sentIssues: IssueWithParsedTitleAndStrippedDate[];
};

const emptyServerProps: Props = {
  newsletterId: "",
  newsletterTitle: "",
  sentIssues: [],
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
      issues: true,
    },
  });

  if (!newsletter) {
    res.statusCode = 302;
    res.setHeader("location", "/404");
    return { props: emptyServerProps };
  }

  const sentIssues =
    newsletter.issues
      ?.filter((issue) => !!issue.sentAt)
      .map((issue) => ({
        ...stripDate(issue),
        title: getTitleFromContent(issue.content),
      })) ?? [];

  return {
    props: { newsletterId, newsletterTitle: newsletter.title, sentIssues },
  };
};

const SentPage: NextPage<Props> = ({
  newsletterId,
  newsletterTitle,
  sentIssues,
}) => {
  const router = useRouter();
  const appHref = useAppHref();

  const onItemClick = (issue: IssueWithParsedTitleAndStrippedDate) => {
    router.push(`${appHref}/compose?i=${issue.id}`);
  };
  const onItemDuplicate = async (
    issue: IssueWithParsedTitleAndStrippedDate
  ) => {
    await issueService.createIssue(newsletterId, issue.fileName, issue.content);
    router.replace(appHref);
  };
  const onItemDelete = async (issue: IssueWithParsedTitleAndStrippedDate) => {
    await issueService.deleteIssue(issue.id);
    router.replace(`${appHref}/sent`);
  };

  return (
    <ProtectedPage>
      <Layout headerTitle={newsletterTitle}>
        <NextSeo title={`Sent – ${newsletterTitle}`} />
        <Dashboard>
          {!sentIssues.length ? (
            <EmptyTab
              emoji="📭"
              title="Nothing sent yet"
              subtitle={
                <>
                  Click <b>Compose</b> to get going
                </>
              }
            />
          ) : (
            <EnhancedTable
              type="sentIssues"
              items={sentIssues}
              onItemClick={onItemClick}
              onItemDuplicate={onItemDuplicate}
              onItemDelete={onItemDelete}
            />
          )}
        </Dashboard>
      </Layout>
    </ProtectedPage>
  );
};

export default SentPage;
