import Typography from "@mui/material/Typography";
import { Issue, Newsletter } from "@prisma/client";
import Link from "next/link";
import { GetServerSideProps } from "next/types";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { FC } from "react";

import Layout from "../../src/components/Layout";
import { ProtectedPage } from "../../src/components/ProtectedPage";
import { Dashboard } from "../../src/containers/dashboard/Dashboard";
import prisma from "../../src/prisma/prisma";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { newsletter: {}, files: [] } };
  }

  const newsletter = await prisma.newsletter.findFirst({
    where: { author: { email: session.user.email } },
    include: {
      issues: true,
      githubIntegration: true,
    },
  });

  return {
    props: { newsletter },
  };
};

type Props = {
  newsletter: Newsletter & {
    issues: Issue[];
  };
};

const Drafts: FC<Props> = ({ newsletter }) => {
  const title = newsletter.title;
  const issues = newsletter.issues;

  return (
    <ProtectedPage>
      <Layout>
        <NextSeo title="Drafts" />
        <Dashboard title={title} value={0}>
          {!issues.length && (
            <Typography variant="body1">No issues found.</Typography>
          )}
          {issues.map((issue) => (
            <Link key={issue.id} href={`/app/publish/${issue.id}`}>
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

export default Drafts;
