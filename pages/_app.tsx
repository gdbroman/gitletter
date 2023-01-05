import "../styles/globals.css";
import "../styles/nprogress.css";

import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";

import { NewsletterContextProvider } from "../src/contexts/newsletter";
import { ThemeContextProvider } from "../src/contexts/theme";
import * as ga from "../util/lib/googleAnalytics";
import { progressIndicator } from "../util/lib/progressIndicator";
import { trpc } from "../util/trpc";

type AppPropsWithSession = AppProps & {
  pageProps: AppProps["pageProps"] & {
    session: Session;
  };
};

const App = ({ Component, pageProps }: AppPropsWithSession) => {
  const router = useRouter();

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles?.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  useEffect(() => {
    const handleStart = () => {
      progressIndicator.start();
    };
    const handleStop = () => {
      progressIndicator.done();
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      ga.sendPageView(url);
    };
    //When the component is mounted, subscribe to router changes
    //and log those page views
    router.events.on("routeChangeComplete", handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <SessionProvider session={pageProps.session}>
      <NewsletterContextProvider>
        <ThemeContextProvider>
          <Component {...pageProps} />
        </ThemeContextProvider>
      </NewsletterContextProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(App);
