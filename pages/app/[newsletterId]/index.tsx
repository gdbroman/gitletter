import { useRouter } from "next/router";
import { GetServerSideProps, NextPage } from "next/types";
import { NextSeo } from "next-seo";

import prisma from "../../../prisma/prisma";
import { EmptyTab } from "../../../src/components/EmptyTab";
import { EnhancedTable } from "../../../src/components/EnhancedTable";
import Layout from "../../../src/components/Layout";
import { ProtectedPage } from "../../../src/components/ProtectedPage";
import { Dashboard } from "../../../src/containers/dashboard/Dashboard";
import { issueService } from "../../../src/services/issueService";
import {
  IssueWithParsedTitleAndStrippedDate,
  stripDate,
} from "../../../src/types/stripDate";
import { useAppHref } from "../../../util/hooks/useAppHref";
import { getTitleFromContent } from "../../../util/strings";

type Props = {
  newsletterId: string;
  newsletterTitle: string;
  draftIssues: IssueWithParsedTitleAndStrippedDate[];
};

const emptyServerProps: Props = {
  newsletterId: "",
  newsletterTitle: "",
  draftIssues: [],
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

  const newsletter = await prisma.newsletter.findFirst({
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

  const draftIssues =
    newsletter.issues
      ?.filter((issue) => !issue.sentAt)
      .map((issue) => ({
        ...stripDate(issue),
        title: getTitleFromContent(issue.content),
      })) ?? [];

  return {
    props: { newsletterId, newsletterTitle: newsletter.title, draftIssues },
  };
};

const DraftsPage: NextPage<Props> = ({
  newsletterId,
  newsletterTitle,
  draftIssues,
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
    router.replace(appHref);
  };

  return (
    <ProtectedPage>
      <Layout headerTitle={newsletterTitle}>
        <NextSeo title={`Drafts – ${newsletterTitle}`} />
        <Dashboard>
          {!draftIssues.length ? (
            <EmptyTab
              emoji="📝"
              title="No drafts found"
              subtitle={
                <>
                  Click <b>Compose</b> to get going
                </>
              }
            />
          ) : (
            <EnhancedTable
              type="drafts"
              items={draftIssues}
              onItemClick={onItemClick}
              onItemDuplicate={onItemDuplicate}
              onItemDelete={onItemDelete}
              disablePagination
            />
          )}
        </Dashboard>
      </Layout>
    </ProtectedPage>
  );
};

export default DraftsPage;
