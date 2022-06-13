import "../styles/globals.css";

import { CacheProvider } from "@emotion/react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { FC } from "react";

import { NewsletterProvider } from "../contexts/NewsletterContext";
import theme from "../styles/theme";
import createEmotionCache from "../util/createEmotionCache";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

type AppPropsExtended = {
  emotionCache?: typeof clientSideEmotionCache;
} & AppProps;

const App: FC<AppPropsExtended> = ({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}) => (
  <CacheProvider value={emotionCache}>
    <SessionProvider session={pageProps.session}>
      <NewsletterProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </NewsletterProvider>
    </SessionProvider>
  </CacheProvider>
);

export default App;
