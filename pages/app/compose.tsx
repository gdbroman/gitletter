import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Issue, Newsletter } from "@prisma/client";
import { GetServerSideProps } from "next/types";
import { getSession } from "next-auth/react";
import { FC } from "react";

import Layout from "../../src/components/Layout";
import { ProtectedPage } from "../../src/components/ProtectedPage";
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

const New: FC<Props> = ({ newsletter }) => {
  const title = newsletter.title;

  return (
    <ProtectedPage>
      <Layout>
        <main>
          <Typography variant="h1" fontWeight="bold">
            New issue
          </Typography>
          <TextField placeholder="write something here" />
        </main>
      </Layout>
    </ProtectedPage>
  );
};

export default New;
