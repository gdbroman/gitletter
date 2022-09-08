import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GitHubIcon from "@mui/icons-material/GitHub";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import Image from "next/image";
import { useRouter } from "next/router";
import { NextPage } from "next/types";
import { useSession } from "next-auth/react";
import { useRef } from "react";

import { FeedbackFooter } from "../src/components/FeedbackFooter";
import Layout from "../src/components/Layout";
import { SubscriptionCard } from "../src/components/SubscriptionCard";
import { useThemeContext } from "../src/contexts/theme";
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
import { GAEventAction } from "../util/lib/googleAnalytics";
import { numberToStringWithSpaces } from "../util/strings";
import { ButtonRef } from "../util/types";

const LandingPage: NextPage = () => {
  const router = useRouter();
  const appHref = useAppHref();
  const session = useSession();
  const { signIn, loadingRef } = useSignIn();
  const { theme } = useThemeContext();
  const mediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const redirecting = useToggle(false);

  const getStartedFreeButtonRef = useRef<HTMLButtonElement>(null);
  const freeTierButtonRef = useRef<HTMLButtonElement>(null);
  const fullAccessButtonRef = useRef<HTMLButtonElement>(null);

  const goToApp = () => {
    try {
      ga.sendEvent({
        action: GAEventAction.LOGIN,
        label: "Go to App",
      });
      router.push(appHref);
    } catch (e) {
      console.error(e);
      redirecting.toggleOff();
    }
  };
  const getStarted = (ref: ButtonRef, label: string) => {
    signIn(ref);
    ga.sendEvent({
      action: GAEventAction.SIGN_UP,
      label,
    });
  };
  const bookDemo = () => {
    ga.sendEvent({
      action: GAEventAction.SIGN_UP,
      label: "Book demo",
    });
    router.push(calendlyLink);
  };

  return (
    <Layout footer={<FeedbackFooter />}>
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
                getStarted(getStartedFreeButtonRef, "Get started free")
              }
            >
              Get started free
            </LoadingButton>
          )}
        </Box>
        <Box my={10}>
          {/* <YoutubeDemo /> */}
          <div
            style={{
              boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
              borderRadius: "0.5rem",
              overflow: "hidden",
            }}
          >
            <Image src="/demo/demo.png" width={1662} height={1042} />
          </div>
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
                onClick={() => getStarted(freeTierButtonRef, "Indie writer")}
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
                ref={fullAccessButtonRef}
                loading={loadingRef === fullAccessButtonRef}
                onClick={() => getStarted(fullAccessButtonRef, "Beast mode")}
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

export default LandingPage;
