import Typography from "@mui/material/Typography";
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
import { NewsletterWithIssues } from "./index";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { newsletter: {}, files: [] } };
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

type Props = {
  newsletter: NewsletterWithIssues;
};

const Sent: FC<Props> = ({ newsletter }) => {
  const title = newsletter.title;
  const sentIssues = newsletter.issues.filter((issue) => !!issue.sentAt);
  const newsletterId = newsletter.id;

  return (
    <ProtectedPage>
      <Layout>
        <NextSeo title="Sent" />
        <Dashboard title={title} value={1} newsletterId={newsletterId}>
          {!sentIssues.length ? (
            <Typography variant="body1">No sent issues found.</Typography>
          ) : (
            <EnhancedTable
              newsletterId={newsletterId}
              issues={sentIssues}
              sentAt
            />
          )}
        </Dashboard>
      </Layout>
    </ProtectedPage>
  );
};

export default Sent;
