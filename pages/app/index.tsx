import Typography from "@mui/material/Typography";
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
import { createIssue, deleteIssue } from "../../src/services/issue";
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

const Drafts: FC<Props> = ({ newsletter }) => {
  const router = useRouter();

  const title = newsletter.title;
  const drafts = newsletter.issues?.filter((issue) => !issue.sentAt) ?? [];
  const newsletterId = newsletter.id;

  const onItemClick = (issue: IssueWithStrippedDate) => {
    router.push(`/app/compose?n=${newsletterId}&i=${issue.id}`);
  };
  const onItemDuplicate = async (issue: IssueWithStrippedDate) => {
    await createIssue(issue.title, issue.content, newsletterId);
    router.replace(`/app`);
  };
  const onItemDelete = async (issue: IssueWithStrippedDate) => {
    await deleteIssue(issue.id);
    router.replace(`/app`);
  };

  return (
    <ProtectedPage>
      <Layout>
        <NextSeo title="Drafts" />
        <Dashboard title={title} value={0} newsletterId={newsletterId}>
          {!drafts.length ? (
            <Typography variant="body1">No drafts found.</Typography>
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
