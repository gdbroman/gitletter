import { Typography } from "@mui/material";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { FC } from "react";

import Layout from "../../components/Layout";
import { ProtectedPage } from "../../components/ProtectedPage";

const Home: FC = () => {
  const session = useSession();

  return (
    <ProtectedPage>
      <Layout>
        <div className="page">
          <h1>Settings</h1>
          <main>
            <Image src={session.data?.user.image} width={100} height={100} />
            <Typography>{session.data?.user.email}</Typography>
            <Typography>{session.data?.user.name}</Typography>
          </main>
        </div>
      </Layout>
    </ProtectedPage>
  );
};

export default Home;
