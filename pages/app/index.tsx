import Typography from "@mui/material/Typography";
import { Issue, Newsletter } from "@prisma/client";
import { GetServerSideProps } from "next/types";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { FC } from "react";

import { EnhancedTable } from "../../src/components/EnhancedTable";
import Layout from "../../src/components/Layout";
import { ProtectedPage } from "../../src/components/ProtectedPage";
import { Dashboard } from "../../src/containers/dashboard/Dashboard";
import prisma from "../../src/prisma/prisma";

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
    props: { newsletterString: JSON.stringify(newsletter) },
  };
};

type Props = {
  newsletterString: string;
};

const Drafts: FC<Props> = ({ newsletterString }) => {
  const newsletter = JSON.parse(newsletterString) as Newsletter & {
    issues: Issue[];
  };
  const title = newsletter.title;
  const drafts = newsletter.issues?.filter((issue) => !issue.sent) ?? [];
  const newsletterId = newsletter.id;

  return (
    <ProtectedPage>
      <Layout>
        <NextSeo title="Drafts" />
        <Dashboard title={title} value={0} newsletterId={newsletterId}>
          {!drafts.length ? (
            <Typography variant="body1">No drafts found.</Typography>
          ) : (
            <EnhancedTable issues={drafts} />
          )}
        </Dashboard>
      </Layout>
    </ProtectedPage>
  );
};

export default Drafts;
