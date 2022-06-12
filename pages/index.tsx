import GitHubIcon from "@mui/icons-material/GitHub";
import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import Router from "next/router";
import { useSession } from "next-auth/react";
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
            <Link href="/api/auth/signin" passHref>
              <Button
                variant="contained"
                size="large"
                startIcon={<GitHubIcon />}
              >
                Get started free
              </Button>
            </Link>
          </Box>
        </main>
      </div>
    </Layout>
  );
};

export default Home;
