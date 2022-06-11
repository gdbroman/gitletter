import "../styles/globals.css";

import { CacheProvider } from "@emotion/react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";

import theme from "../styles/theme";
import createEmotionCache from "../util/createEmotionCache";

const clientSideEmotionCache = createEmotionCache();

type AppPropsExtended = {
  emotionCache?: typeof clientSideEmotionCache;
} & AppProps;

const App = ({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: AppPropsExtended) => (
  <SessionProvider session={pageProps.session}>
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  </SessionProvider>
);

export default App;
