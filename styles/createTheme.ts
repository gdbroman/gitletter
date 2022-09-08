import { red } from "@mui/material/colors";
import {
  BreakpointsOptions,
  Components,
  createTheme as createMuiTheme,
  PaletteOptions,
  responsiveFontSizes,
  ThemeOptions,
} from "@mui/material/styles";
import { TypographyOptions } from "@mui/material/styles/createTypography";

const breakpoints: BreakpointsOptions = {
  values: {
    xs: 420,
    sm: 500,
    md: 600,
    lg: 800,
    xl: 1000,
  },
};

const typography: TypographyOptions = {
  fontFamily: [
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(","),
  h1: {
    fontSize: "60px",
  },
  h2: {
    fontSize: "53px",
  },
  h3: {
    fontSize: "42px",
  },
  h4: {
    fontSize: "36px",
  },
  h5: {
    fontSize: "24px",
  },
  body1: {
    fontSize: "18px",
  },
  body2: {
    fontSize: "16px",
  },
  button: {
    textTransform: "none",
  },
};

const components: Components = {
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        "&:disabled": {
          opacity: 0.5,
          cursor: "not-allowed",
          color: "#000000",
        },
      },
    },
  },
  MuiCheckbox: {
    styleOverrides: {
      root: {
        "&.Mui-disabled": {
          cursor: "not-allowed",
          color: "rgba(0, 0, 0, 0.38)",
        },
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        "&.Mui-disabled": {
          "& fieldset.MuiOutlinedInput-notchedOutline": {
            border: "1px solid rgba(0, 0, 0, 0.12)",
          },
        },
      },
    },
  },
};

const lightPalette: PaletteOptions = {
  mode: "light",
  primary: {
    main: "#ffffff",
    light: "#eeeeee",
  },
  secondary: {
    main: "#000000",
    light: "#333333",
  },
  error: {
    main: red.A400,
  },
  action: {
    disabledBackground: "000000",
    disabled: "#FFFFFF",
  },
  background: {
    default: "#FFFFFF",
  },
};

const darkPalette: PaletteOptions = {
  mode: "dark",
  primary: {
    main: "#000000",
    light: "#121212",
  },
  secondary: {
    main: "#ffffff",
    light: "#eeeeee",
  },
  error: {
    main: red.A400,
  },
  action: {
    disabledBackground: "000000",
    disabled: "#FFFFFF",
  },
  background: {
    default: "#000000",
  },
};

const themes: Record<string, ThemeOptions> = {
  light: {
    palette: lightPalette,
    typography,
    breakpoints,
    components,
  },
  dark: {
    palette: darkPalette,
    typography,
    breakpoints,
    components,
  },
};

export type ColorMode = "light" | "dark";

export const createTheme = (colorMode: ColorMode) =>
  responsiveFontSizes(createMuiTheme(themes[colorMode]));
