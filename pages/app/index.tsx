import Typography from "@mui/material/Typography";
import { Issue, Newsletter } from "@prisma/client";
import Link from "next/link";
import { GetServerSideProps } from "next/types";
import { getSession } from "next-auth/react";
import { FC } from "react";

import { Dashboard } from "../../components/Dashboard/Dashboard";
import Layout from "../../components/Layout";
import { ProtectedPage } from "../../components/ProtectedPage";
import { getRepoContent } from "../../util/githubClient";
import prisma from "../../util/prisma";

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
        ).filter((f) => f.type === "file") ?? [];
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

const AppPublish: FC<Props> = ({ newsletter, files }) => {
  const title = newsletter.title;
  console.log("FE", files);

  return (
    <ProtectedPage>
      <Layout>
        <Dashboard title={title} value={0}>
          {!files.length && (
            <Typography variant="body1">
              No issues found. Make sure that you have{" "}
              <Link href="/app/settings">connected to a GitHub repository</Link>{" "}
              with issues in it.
            </Typography>
          )}
          {files.map((issue) => (
            <Link key={issue.name} href={`/app/publish/${issue.name}`}>
              <h3>{issue.name}</h3>
            </Link>
          ))}
        </Dashboard>
      </Layout>
    </ProtectedPage>
  );
};

export default AppPublish;
