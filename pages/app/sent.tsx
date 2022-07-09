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
import { issueService } from "../../src/services/issueService";
import { IssueWithStrippedDate, stripDate } from "../../src/types/stripDate";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 401;
    return { props: { newsletter: { issues: [] } } };
  }

  const newsletter =
    (await prisma.newsletter.findFirst({
      where: { author: { email: session.user.email } },
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

const Sent: FC<Props> = ({ newsletter }) => {
  const router = useRouter();

  const title = newsletter.title;
  const sentIssues = newsletter.issues.filter((issue) => !!issue.sentAt);
  const newsletterId = newsletter.id;

  const onItemClick = (issue: IssueWithStrippedDate) => {
    router.push(`/app/compose?n=${newsletterId}&i=${issue.id}`);
  };
  const onItemDuplicate = async (issue: IssueWithStrippedDate) => {
    await issueService.createIssue(newsletterId, issue.fileName, issue.content);
    router.replace(`/app`);
  };
  const onItemDelete = async (issue: IssueWithStrippedDate) => {
    await issueService.deleteIssue(issue.id);
    router.replace(`/app/sent`);
  };

  return (
    <ProtectedPage>
      <Layout>
        <NextSeo title="Sent" />
        <Dashboard title={title} value={1} newsletterId={newsletterId}>
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

export default Sent;
