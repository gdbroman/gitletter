import "../styles/globals.css";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { FC, useEffect } from "react";

import { NewsletterProvider } from "../contexts/NewsletterContext";
import theme from "../styles/theme";

const App: FC<AppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <SessionProvider session={pageProps.session}>
      <NewsletterProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </NewsletterProvider>
    </SessionProvider>
  );
};

export default App;
