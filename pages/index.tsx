import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GitHubIcon from "@mui/icons-material/GitHub";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { FC } from "react";

import Layout from "../src/components/Layout";
import {
  calendlyLink,
  siteDescription,
  siteTagline,
} from "../src/util/constants";
import { useSignIn, useToggle } from "../src/util/hooks";

const Home: FC = () => {
  const router = useRouter();
  const session = useSession();
  const { signIn, loading } = useSignIn();

  const redirecting = useToggle(false);

  const goToApp = () => {
    redirecting.toggleOn();
    try {
      router.push("/app");
    } catch (e) {
      console.error(e);
      redirecting.toggleOff();
    }
  };

  // useEffect(() => {
  //   if (session.data?.user) {
  //     router.push("/app");
  //   }
  // }, [router, session.data?.user]);

  return (
    <Layout>
      <main>
        <Box mx="auto" my={4} textAlign="center">
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
          <Box display="flex" justifyContent="center" gap={2}>
            <Button
              size="large"
              variant="outlined"
              href={calendlyLink}
              target="_blank"
            >
              Book demo
            </Button>
            {session.status === "authenticated" ? (
              <LoadingButton
                size="large"
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                style={{ fontSize: "1rem" }}
                loading={redirecting.isOn}
                onClick={goToApp}
              >
                Go to app
              </LoadingButton>
            ) : (
              <LoadingButton
                size="large"
                variant="contained"
                startIcon={<GitHubIcon />}
                style={{ fontSize: "1rem" }}
                loading={loading}
                onClick={signIn}
              >
                Get started free
              </LoadingButton>
            )}
          </Box>
        </Box>
        <Box textAlign="center">
          <Image src={"/demo/screen1.png"} width={603} height={360} />
          {/* <Image
            src={"/demo/screen2.png"}
            width={620}
            height={320}
            style={{ borderRadius: 8 }}
          /> */}
        </Box>
      </main>
    </Layout>
  );
};

export default Home;
