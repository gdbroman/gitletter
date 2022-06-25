import Typography from "@mui/material/Typography";
import { Issue, Newsletter } from "@prisma/client";
import { GetServerSideProps } from "next/types";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { FC } from "react";

import prisma from "../../prisma/prisma";
import { EnhancedTable } from "../../src/components/EnhancedTable";
import Layout from "../../src/components/Layout";
import { ProtectedPage } from "../../src/components/ProtectedPage";
import { Dashboard } from "../../src/containers/dashboard/Dashboard";
import { dateStripped } from "../../src/types/helpers";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { newsletter: {} } };
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
    props: { newsletter: dateStripped(newsletter) },
  };
};

export type IssueWithStrippedDate = Issue & {
  createdAt: string;
  updatedAt: string;
};

export type NewsletterWithIssues = Pick<Newsletter, "id" | "title"> & {
  issues: IssueWithStrippedDate[];
};

type Props = {
  newsletter: NewsletterWithIssues;
};

const Drafts: FC<Props> = ({ newsletter }) => {
  const title = newsletter.title;
  const drafts = newsletter.issues?.filter((issue) => !issue.sentAt) ?? [];
  const newsletterId = newsletter.id;

  return (
    <ProtectedPage>
      <Layout>
        <NextSeo title="Drafts" />
        <Dashboard title={title} value={0} newsletterId={newsletterId}>
          {!drafts.length ? (
            <Typography variant="body1">No drafts found.</Typography>
          ) : (
            <EnhancedTable newsletterId={newsletterId} issues={drafts} />
          )}
        </Dashboard>
      </Layout>
    </ProtectedPage>
  );
};

export default Drafts;
