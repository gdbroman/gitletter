import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GitHubIcon from "@mui/icons-material/GitHub";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { FC } from "react";

import Layout from "../src/components/Layout";
import { calendlyLink, siteDescription, siteTagline } from "../util/constants";
import { useAppHref } from "../util/hooks/useAppHref";
import { useSignIn } from "../util/hooks/useSignIn";
import { useToggle } from "../util/hooks/useToggle";
import * as ga from "../util/lib/googleAnalytics";

const Home: FC = () => {
  const router = useRouter();
  const session = useSession();
  const appHref = useAppHref();
  const { signIn, loading } = useSignIn();

  const redirecting = useToggle(false);

  const goToApp = () => {
    redirecting.toggleOn();
    try {
      router.push(appHref);
    } catch (e) {
      console.error(e);
      redirecting.toggleOff();
    }
  };

  const getStartedFree = () => {
    signIn();
    ga.event({
      action: "Get started free CTA",
      params: {
        view: "Landing page",
      },
    });
  };

  return (
    <Layout>
      <main>
        <Box mx="auto" my={6} textAlign="center" maxWidth={580}>
          <Typography variant="h1" fontWeight="bold">
            {siteTagline}
          </Typography>
          <Typography
            variant="body1"
            fontWeight="medium"
            mt={3}
            mb={4}
            ml="auto"
            mr="auto"
            style={{
              fontSize: "2rem",
              maxWidth: "500px",
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
                onClick={getStartedFree}
              >
                Get started free
              </LoadingButton>
            )}
          </Box>
        </Box>
        <Box textAlign="center">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/PoJV0ay9PRc"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Box>
      </main>
    </Layout>
  );
};

export default Home;
