import { GithubIntegration, Newsletter } from "@prisma/client";
import { GetServerSideProps } from "next/types";
import { getSession } from "next-auth/react";
import { FC } from "react";

import Layout from "../../components/Layout";
import { ProtectedPage } from "../../components/ProtectedPage";
import { useNewsletterContext } from "../../contexts/NewsletterContext";
import prisma from "../../lib/prisma";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { drafts: [] } };
  }

  const newsletter = await prisma.newsletter.findFirst({
    where: { author: { email: session.user.email } },
    include: {
      githubIntegration: true,
    },
  });

  return {
    props: { newsletter },
  };
};

type Props = {
  newsletter: Newsletter & {
    githubIntegration?: GithubIntegration;
  };
};

const Home: FC<Props> = ({ newsletter }) => {
  const { setNewsletter } = useNewsletterContext();

  if (newsletter) {
    setNewsletter(newsletter);
    return (
      <ProtectedPage>
        <Layout>
          <h1>{newsletter.title}</h1>
          <main>
            {!newsletter?.githubIntegration?.installationId && (
              <a href={process.env.GITHUB_APP_URL}>
                <button>Connect your repo</button>
              </a>
            )}
          </main>
        </Layout>
      </ProtectedPage>
    );
  }

  return (
    <ProtectedPage>
      <Layout>
        <div className="page">
          <h1>Your newsletter</h1>
          <main>
            <a href={process.env.GITHUB_APP_URL}>
              <button>Connect your repo</button>
            </a>
          </main>
        </div>
      </Layout>
    </ProtectedPage>
  );
};

export default Home;
