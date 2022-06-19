import { Issue, Newsletter } from "@prisma/client";
import { GetServerSideProps } from "next/types";
import { getSession } from "next-auth/react";
import { FC } from "react";

import { Dashboard } from "../../components/Dashboard/Dashboard";
import Layout from "../../components/Layout";
import { ProtectedPage } from "../../components/ProtectedPage";
import prisma from "../../util/prisma";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { drafts: [] } };
  }

  const newsletter = await prisma.newsletter.findFirst({
    where: { author: { email: session.user.email } },
    include: {
      issues: true,
    },
  });

  return {
    props: { newsletter },
  };
};

type Props = {
  newsletter?: Newsletter & {
    issues: Issue[];
  };
};

const AppPublish: FC<Props> = ({ newsletter }) => {
  const title = newsletter?.title;
  const issues = newsletter?.issues;

  return (
    <ProtectedPage>
      <Layout>
        <Dashboard title={title} value={0}>
          {!issues.length && <p>No issues found</p>}
          {issues.map((issue) => (
            <div key={issue.id}>
              <h3>{issue.title}</h3>
            </div>
          ))}
        </Dashboard>
      </Layout>
    </ProtectedPage>
  );
};

export default AppPublish;
