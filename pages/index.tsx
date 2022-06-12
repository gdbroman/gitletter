import Router from "next/router";
import { useSession } from "next-auth/react";
import { FC, useEffect } from "react";

import Layout from "../components/Layout";

const Home: FC = () => {
  const session = useSession();

  useEffect(() => {
    if (session.data?.user) {
      Router.push("/account");
    }
  }, [session]);

  return (
    <Layout>
      <div className="page">
        <h1>Start a newsletter using GitHub</h1>
        <main>
          <p>
            Host your issues in one repository, like your existing markdown blog
            – or let GitLetter set one up for you.
          </p>
        </main>
      </div>
    </Layout>
  );
};

export default Home;
