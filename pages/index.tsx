import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GitHubIcon from "@mui/icons-material/GitHub";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useSession } from "next-auth/react";
import { FC, useRef } from "react";

import Layout from "../src/components/Layout";
import { SubscriptionCard } from "../src/components/SubscriptionCard";
import { YoutubeDemo } from "../src/components/YoutubeDemo";
import theme from "../styles/theme";
import {
  calendlyLink,
  freeSubscriberLimit,
  siteDescription,
  siteTagline,
} from "../util/constants";
import { useSignIn } from "../util/hooks/useSignIn";
import * as ga from "../util/lib/googleAnalytics";
import { numberToStringWithSpaces } from "../util/strings";

const Home: FC = () => {
  const session = useSession();
  const { signIn, loadingRef } = useSignIn();
  const mediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const getStartedFreeButtonRef = useRef<HTMLButtonElement>(null);
  const freeTierButtonRef = useRef<HTMLButtonElement>(null);
  const fullAccessButtonRef = useRef<HTMLButtonElement>(null);

  const getStartedFree = () => {
    signIn(getStartedFreeButtonRef);
    ga.event({
      action: "Get started free CTA",
      params: {
        view: "Landing page",
      },
    });
  };
  const getStartedFreeTier = () => {
    signIn(freeTierButtonRef);
    ga.event({
      action: "Free tier CTA",
      params: {
        view: "Landing page",
      },
    });
  };
  const getStartedFullAccess = () => {
    signIn(fullAccessButtonRef);
    ga.event({
      action: "Full access CTA",
      params: {
        view: "Landing page",
      },
    });
  };

  return (
    <Layout>
      <Box mx="auto" my={6} textAlign="center" maxWidth={640}>
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
            maxWidth: "480px",
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
              ref={getStartedFreeButtonRef}
              loading={loadingRef === getStartedFreeButtonRef}
              onClick={getStartedFree}
            >
              Go to app
            </LoadingButton>
          ) : (
            <LoadingButton
              size="large"
              variant="contained"
              startIcon={<GitHubIcon />}
              style={{ fontSize: "1rem" }}
              ref={getStartedFreeButtonRef}
              loading={loadingRef === getStartedFreeButtonRef}
              onClick={getStartedFree}
            >
              Get started free
            </LoadingButton>
          )}
        </Box>
        <Box my={10}>
          <YoutubeDemo />
        </Box>
        <Typography variant="h3" fontWeight="bold" textAlign="center" mb={4}>
          Become Your Own Publisher
        </Typography>
        <Box
          display="flex"
          flexDirection={mediumScreen ? "column-reverse" : "row"}
          justifyContent="center"
          alignItems="center"
          gap={4}
          mb={4}
        >
          <SubscriptionCard
            title="✍️ Indie writer"
            price="$0 / month"
            features={[
              `${numberToStringWithSpaces(freeSubscriberLimit)} subscribers`,
              "Full access to all features",
            ]}
            fullWidth={mediumScreen}
            button={
              <LoadingButton
                size="large"
                fullWidth
                variant="outlined"
                ref={freeTierButtonRef}
                loading={loadingRef === freeTierButtonRef}
                onClick={getStartedFreeTier}
              >
                Get started
              </LoadingButton>
            }
          />
          <SubscriptionCard
            title="💥 Beast mode"
            price="$29 / month"
            features={["Unlimited subscribers", "100% Money-back guarantee"]}
            fullWidth={mediumScreen}
            button={
              <LoadingButton
                size="large"
                fullWidth
                variant="contained"
                ref={freeTierButtonRef}
                loading={loadingRef === fullAccessButtonRef}
                onClick={getStartedFullAccess}
              >
                Get started
              </LoadingButton>
            }
          />
        </Box>
      </Box>
    </Layout>
  );
};

export default Home;
