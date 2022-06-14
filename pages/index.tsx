import GitHubIcon from "@mui/icons-material/GitHub";
import { Box, Button, Typography } from "@mui/material";
import Router from "next/router";
import { signIn, useSession } from "next-auth/react";
import { FC, useEffect } from "react";

import Layout from "../components/Layout";
import { siteDescription, siteTagline } from "../util/constants";

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
            <Button
              variant="contained"
              size="large"
              startIcon={<GitHubIcon />}
              onClick={() => signIn("github", { callbackUrl: "/account" })}
            >
              Get started free
            </Button>
          </Box>
        </main>
      </div>
    </Layout>
  );
};

export default Home;
