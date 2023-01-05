import { green, red } from "@mui/material/colors";
import type {
  BreakpointsOptions,
  Components,
  PaletteOptions,
  ThemeOptions,
} from "@mui/material/styles";
import {
  createTheme as createMuiTheme,
  responsiveFontSizes,
} from "@mui/material/styles";
import type { TypographyOptions } from "@mui/material/styles/createTypography";

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
    main: "#000000",
    light: "#333333",
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
    default: "#FFFFFF",
  },
};

const darkPalette: PaletteOptions = {
  mode: "dark",
  primary: {
    main: "#ffffff",
    light: "#eeeeee",
  },
  secondary: {
    main: "#000000",
    light: "#121212",
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
    components: {
      ...components,
      MuiButton: {
        ...components.MuiButton,
        styleOverrides: {
          root: {
            "&:disabled": {
              color: "#000000",
              opacity: 0.6,
            },
          },
        },
      },
    },
  },
  dark: {
    palette: darkPalette,
    typography,
    breakpoints,
    components: {
      ...components,
      MuiButton: {
        ...components.MuiButton,
        styleOverrides: {
          root: {
            "&:disabled": {
              color: "#FFFFFF",
              opacity: 0.6,
            },
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          standardSuccess: {
            backgroundColor: green[800],
            color: "white",
          },
          standardInfo: {
            backgroundColor: "#3f51b5",
            color: "white",
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            color: "white",
          },
        },
      },
    },
  },
};

export type ColorMode = "light" | "dark";

export const createTheme = (colorMode: ColorMode) =>
  responsiveFontSizes(createMuiTheme(themes[colorMode]));
