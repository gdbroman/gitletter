import Typography from "@mui/material/Typography";
import { Issue, Newsletter } from "@prisma/client";
import Link from "next/link";
import { GetServerSideProps } from "next/types";
import { getSession } from "next-auth/react";
import { FC } from "react";

import Layout from "../../src/components/Layout";
import { ProtectedPage } from "../../src/components/ProtectedPage";
import { Dashboard } from "../../src/containers/dashboard/Dashboard";
import prisma from "../../src/prisma/prisma";
import { getRepoContent } from "../../src/util/githubClient";

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

  let files = [];
  if (newsletter.githubIntegration) {
    try {
      files =
        (
          await getRepoContent(newsletter.githubIntegration.installationId)
        ).filter(({ type, name }) => type === "file" && name.endsWith(".md")) ??
        [];
    } catch (e) {
      console.error(e);
    }
  }
  return {
    props: { newsletter, files },
  };
};

type Props = {
  newsletter: Newsletter & {
    issues: Issue[];
  };
  files: any[];
};

const Sent: FC<Props> = ({ newsletter, files }) => {
  const title = newsletter.title;

  return (
    <ProtectedPage>
      <Layout>
        <Dashboard title={title} value={1}>
          {!files.length && (
            <Typography variant="body1">No issues found.</Typography>
          )}
          {files.map((issue) => (
            <Link key={issue.name} href={`/app/publish/${issue.name}`}>
              <Typography variant="h5" fontWeight="bold">
                {issue.name}
              </Typography>
            </Link>
          ))}
        </Dashboard>
      </Layout>
    </ProtectedPage>
  );
};

export default Sent;
