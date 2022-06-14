import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Typography } from "@mui/material";
import Router from "next/router";
import { useSession } from "next-auth/react";
import { FC, useEffect } from "react";

import Layout from "../components/Layout";
import { siteDescription, siteTagline } from "../util/constants";
import { useSignIn } from "../util/hooks";

const Home: FC = () => {
  const session = useSession();
  const { signIn, loading } = useSignIn();

  useEffect(() => {
    if (session.data?.user) {
      Router.push("/account");
    }
  }, [session]);

  return (
    <Layout>
      <div className="page">
        <main>
          <Box maxWidth={780} mx="auto" my="64px" textAlign="center">
            <Typography variant="h1" fontWeight="bold">
              {siteTagline}
            </Typography>
            <Typography
              variant="body1"
              fontWeight="medium"
              mt="16px"
              mb="32px"
              style={{
                fontSize: "24px",
              }}
            >
              {siteDescription}
            </Typography>
            <LoadingButton
              variant="contained"
              size="large"
              loading={loading}
              onClick={signIn}
            >
              Get started free
            </LoadingButton>
          </Box>
        </main>
      </div>
    </Layout>
  );
};

export default Home;
