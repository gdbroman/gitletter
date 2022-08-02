import Typography from "@mui/material/Typography";
import { Issue, Newsletter } from "@prisma/client";
import { GetServerSideProps } from "next/types";
import { FC } from "react";

import prisma from "../../../prisma/prisma";
import Layout from "../../../src/components/Layout";
import { ProtectedPage } from "../../../src/components/ProtectedPage";
import { Dashboard } from "../../../src/containers/dashboard/Dashboard";
import { getRepoContent } from "../../../src/services/githubIntegrationService";

export const getServerSideProps: GetServerSideProps = async ({
  query,
  params,
}) => {
  const newsletterId = query.newsletterId as string;

  const newsletter = await prisma.newsletter.findUnique({
    where: { id: newsletterId },
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
  const newsletterId = newsletter.id;

  return (
    <ProtectedPage>
      <Layout>
        <Dashboard title={title} value={0} newsletterId={newsletterId}>
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
