import GitHubIcon from "@mui/icons-material/GitHub";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { FC, useEffect } from "react";

import Layout from "../components/Layout";
import { siteDescription, siteTagline } from "../util/constants";
import { useSignIn } from "../util/hooks";

const Home: FC = () => {
  const router = useRouter();
  const session = useSession();
  const { signIn, loading } = useSignIn();

  useEffect(() => {
    if (session.data?.user) {
      router.push("/app");
    }
  }, [router, session.data?.user]);

  return (
    <Layout>
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
            startIcon={<GitHubIcon />}
            variant="contained"
            size="large"
            loading={loading}
            onClick={signIn}
          >
            Get started free
          </LoadingButton>
        </Box>
      </main>
    </Layout>
  );
};

export default Home;
