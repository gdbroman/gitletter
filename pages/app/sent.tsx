import Typography from "@mui/material/Typography";
import Link from "next/link";
import { GetServerSideProps } from "next/types";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { FC } from "react";

import Layout from "../../src/components/Layout";
import { ProtectedPage } from "../../src/components/ProtectedPage";
import { Dashboard } from "../../src/containers/dashboard/Dashboard";
import prisma from "../../src/prisma/prisma";
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
  const sentIssues = newsletter.issues.filter((issue) => issue.sent);
  const newsletterId = newsletter.id;

  return (
    <ProtectedPage>
      <Layout>
        <NextSeo title="Sent" />
        <Dashboard title={title} value={1} newsletterId={newsletterId}>
          {!sentIssues.length && (
            <Typography variant="body1">No sent issues found.</Typography>
          )}
          {sentIssues.map((issue) => (
            <Link
              key={issue.id}
              href={`/app/sent?n=${newsletterId}&i=${issue.id}`}
            >
              <Typography variant="h5" fontWeight="bold">
                {issue.title}
              </Typography>
            </Link>
          ))}
        </Dashboard>
      </Layout>
    </ProtectedPage>
  );
};

export default Sent;
