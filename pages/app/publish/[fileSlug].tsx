import Typography from "@mui/material/Typography";
import { Issue, Newsletter } from "@prisma/client";
import { GetServerSideProps } from "next/types";
import { getSession } from "next-auth/react";
import { FC } from "react";

import { Dashboard } from "../../../components/Dashboard/Dashboard";
import Layout from "../../../components/Layout";
import { ProtectedPage } from "../../../components/ProtectedPage";
import { getRepoContent } from "../../../util/githubClient";
import prisma from "../../../util/prisma";

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
}) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { newsletter: {}, files: {} } };
  }

  const newsletter = await prisma.newsletter.findFirst({
    where: { author: { email: session.user.email } },
    include: {
      issues: true,
      githubIntegration: true,
    },
  });

  let file = null;
  if (newsletter.githubIntegration) {
    try {
      file = await getRepoContent(
        newsletter.githubIntegration.installationId,
        params.fileSlug as string
      );
    } catch (e) {
      console.error(e);
    }
  }

  return {
    props: { newsletter, file },
  };
};

type Props = {
  newsletter: Newsletter & {
    issues: Issue[];
  };
  file: any;
};

const AppPublish: FC<Props> = ({ newsletter, file }) => {
  const title = newsletter.title;

  return (
    <ProtectedPage>
      <Layout>
        <Dashboard title={title} value={0}>
          {file ? (
            <>
              <Typography variant="h2">{file.name}</Typography>
              <Typography variant="body1">{file.html_url}</Typography>
            </>
          ) : (
            <Typography variant="h2">Issue not found</Typography>
          )}
        </Dashboard>
      </Layout>
    </ProtectedPage>
  );
};

export default AppPublish;
