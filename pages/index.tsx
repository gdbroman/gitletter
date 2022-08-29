import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GitHubIcon from "@mui/icons-material/GitHub";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { FC, useRef } from "react";

import Layout from "../src/components/Layout";
import { SubscriptionCard } from "../src/components/SubscriptionCard";
import { YoutubeDemo } from "../src/components/YoutubeDemo";
import { PageView, UserAction } from "../src/types/analytics";
import theme from "../styles/theme";
import {
  calendlyLink,
  freeSubscriberLimit,
  siteDescription,
  siteH1,
  siteTagline,
} from "../util/constants";
import { useAppHref } from "../util/hooks/useAppHref";
import { useSignIn } from "../util/hooks/useSignIn";
import { useToggle } from "../util/hooks/useToggle";
import * as ga from "../util/lib/googleAnalytics";
import { numberToStringWithSpaces } from "../util/strings";
import { ButtonRef } from "../util/types";

const Home: FC = () => {
  const router = useRouter();
  const appHref = useAppHref();
  const session = useSession();
  const { signIn, loadingRef } = useSignIn();
  const mediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const redirecting = useToggle(false);

  const getStartedFreeButtonRef = useRef<HTMLButtonElement>(null);
  const freeTierButtonRef = useRef<HTMLButtonElement>(null);
  const fullAccessButtonRef = useRef<HTMLButtonElement>(null);

  const goToApp = () => {
    try {
      router.push(appHref);
    } catch (e) {
      console.error(e);
      redirecting.toggleOff();
    }
  };
  const getStarted = (ref: ButtonRef, action: string) => {
    signIn(ref);
    ga.event({
      action,
      params: {
        view: PageView.LANDING_PAGE,
      },
    });
  };
  const bookDemo = () => {
    ga.event({
      action: UserAction.CLICK_BOOK_DEMO,
      params: {
        view: PageView.LANDING_PAGE,
      },
    });
    router.push(calendlyLink);
  };

  return (
    <Layout>
      <Box mx="auto" my={6} textAlign="center" maxWidth={640}>
        <Typography variant="h1" fontWeight="bold">
          {siteH1}
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
          <Button size="large" variant="outlined" onClick={bookDemo}>
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
              ref={getStartedFreeButtonRef}
              loading={loadingRef === getStartedFreeButtonRef}
              onClick={() =>
                getStarted(
                  getStartedFreeButtonRef,
                  UserAction.CLICK_GET_STARTED_FREE
                )
              }
            >
              Get started free
            </LoadingButton>
          )}
        </Box>
        <Box my={10}>
          <YoutubeDemo />
        </Box>
        <Typography variant="h3" fontWeight="bold" textAlign="center" mb={4}>
          {siteTagline}
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
                onClick={() =>
                  getStarted(freeTierButtonRef, UserAction.CLICK_FREE_TIER)
                }
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
                onClick={() =>
                  getStarted(freeTierButtonRef, UserAction.CLICK_PAID_TIER)
                }
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
