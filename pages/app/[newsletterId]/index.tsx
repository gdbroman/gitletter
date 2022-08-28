import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import { NextSeo } from "next-seo";
import { FC } from "react";

import prisma from "../../../prisma/prisma";
import { EmptyTab } from "../../../src/components/EmptyTab";
import { EnhancedTable } from "../../../src/components/EnhancedTable";
import Layout from "../../../src/components/Layout";
import { ProtectedPage } from "../../../src/components/ProtectedPage";
import { Dashboard } from "../../../src/containers/dashboard/Dashboard";
import { issueService } from "../../../src/services/issueService";
import { IssueWithStrippedDate, stripDate } from "../../../src/types/stripDate";
import { useAppHref } from "../../../util/hooks/useAppHref";

export const getServerSideProps: GetServerSideProps = async ({
  query,
  res,
}) => {
  const newsletterId = query.newsletterId as string;
  if (!newsletterId) {
    res.statusCode = 401;
    return { props: { newsletter: { issues: [] } } };
  }

  const newsletter =
    (await prisma.newsletter.findFirst({
      where: { id: newsletterId },
      select: {
        id: true,
        title: true,
        issues: true,
      },
    })) ?? {};

  return {
    props: { newsletter: stripDate(newsletter) },
  };
};

type Props = {
  newsletter: {
    id: string;
    title: string;
    issues: IssueWithStrippedDate[];
  };
};

const Drafts: FC<Props> = ({ newsletter }) => {
  const router = useRouter();
  const appHref = useAppHref();

  const title = newsletter.title;
  const drafts = newsletter.issues?.filter((issue) => !issue.sentAt) ?? [];
  const newsletterId = newsletter.id;

  const onItemClick = (issue: IssueWithStrippedDate) => {
    router.push(`${appHref}/compose?i=${issue.id}`);
  };
  const onItemDuplicate = async (issue: IssueWithStrippedDate) => {
    await issueService.createIssue(newsletterId, issue.fileName, issue.content);
    router.replace(appHref);
  };
  const onItemDelete = async (issue: IssueWithStrippedDate) => {
    await issueService.deleteIssue(issue.id);
    router.replace(appHref);
  };

  return (
    <ProtectedPage>
      <Layout>
        <NextSeo title="Drafts" />
        <Dashboard title={title} value={0}>
          {!drafts.length ? (
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
              items={drafts}
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

export default Drafts;
