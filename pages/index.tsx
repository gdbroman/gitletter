import { GetServerSideProps } from "next";
import { FC } from "react";

import Layout from "../components/Layout";
import { PostProps } from "../components/Post";
import prisma from "../lib/prisma";

export const getServerSideProps: GetServerSideProps = async () => {
  const feed = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return { props: { feed } };
};

type Props = {
  feed: PostProps[];
};

const Blog: FC<Props> = (props) => {
  return (
    <Layout>
      <div className="page">
        <h1>Home</h1>
        <main>
          <a href="https://github.com/apps/gitletter-dev/installations/new">
            <button>Connect your repo</button>
          </a>
        </main>
      </div>
    </Layout>
  );
};

export default Blog;
