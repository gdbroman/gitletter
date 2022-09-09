import CssBaseline from "@mui/material/CssBaseline";
import { Theme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import Head from "next/head";
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useCookies } from "react-cookie";

import { ColorMode, createTheme } from "../../styles/createTheme";

interface IThemeContext {
  theme: Theme;
  colorMode: ColorMode;
  setColorMode: (colorMode: ColorMode) => void;
}

interface IColorModeContextProvider {
  children: ReactNode;
}

const ThemeContext = createContext<IThemeContext>({} as IThemeContext);

export const ThemeContextProvider: FC<IColorModeContextProvider> = ({
  children,
}) => {
  const defaultColorMode: ColorMode = "light";
  const [colorMode, setColorMode] =
    useState<IThemeContext["colorMode"]>(defaultColorMode);
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
