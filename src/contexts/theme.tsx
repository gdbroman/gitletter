import CssBaseline from "@mui/material/CssBaseline";
import type { Theme } from "@mui/material/styles";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import Head from "next/head";
import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useCookies } from "react-cookie";

import type { ColorMode } from "../../styles/createTheme";
import { createTheme } from "../../styles/createTheme";

interface IThemeContext {
  theme: Theme;
  colorMode: ColorMode;
  isDarkMode: boolean;
  setColorMode: (colorMode: ColorMode) => void;
}

interface IColorModeContextProvider {
  children: ReactNode;
}

const ThemeContext = createContext<IThemeContext>({} as IThemeContext);

export const ThemeContextProvider = ({
  children,
}: IColorModeContextProvider) => {
  const defaultColorMode: ColorMode = "light";
  const [colorMode, setColorMode] =
    useState<IThemeContext["colorMode"]>(defaultColorMode);
  const isDarkMode = useMemo(() => colorMode === "dark", [colorMode]);
  const theme = useMemo(() => createTheme(colorMode), [colorMode]);

  const [cookies, setCookie] = useCookies(["color-mode"]);

  useEffect(() => {
    if (cookies["color-mode"]) {
      setColorMode(cookies["color-mode"]);
    }
  }, [cookies]);

  const handleSetColorMode = useCallback(
    (newColorMode: ColorMode) => {
      setColorMode(newColorMode);
      setCookie("color-mode", newColorMode, { path: "/" });
    },
    [setCookie]
  );

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colorMode,
        isDarkMode,
        setColorMode: handleSetColorMode,
      }}
    >
      <Head>
        <meta name="theme-color" content={theme.palette.secondary.main} />
      </Head>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
