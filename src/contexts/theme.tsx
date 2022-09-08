import CssBaseline from "@mui/material/CssBaseline";
import { Theme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import Head from "next/head";
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

import { ColorMode, createTheme } from "../../styles/theme";

interface IThemeContext {
  theme: Theme;
  colorMode: ColorMode;
  setColorMode: (colorMode: ColorMode) => void;
}

interface IColorModeContextProvider {
  children: ReactNode;
  initialColorMode: ColorMode;
}

const ThemeContext = createContext<IThemeContext>({} as IThemeContext);

export const ThemeContextProvider: FC<IColorModeContextProvider> = ({
  children,
  initialColorMode,
}) => {
  const [colorMode, setColorMode] =
    useState<IThemeContext["colorMode"]>(initialColorMode);
  const theme = useMemo(() => createTheme(colorMode), [colorMode]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colorMode,
        setColorMode,
      }}
    >
      <Head>
        <meta name="theme-color" content={theme.palette.primary.main} />
      </Head>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
