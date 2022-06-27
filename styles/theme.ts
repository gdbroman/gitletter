import { red } from "@mui/material/colors";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#333333",
    },
    error: {
      main: red.A400,
    },
    action: {
      disabledBackground: "000000",
      disabled: "#FFFFFF",
    },
  },
  typography: {
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
  },
  components: {
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
  },
});

const themeWithResponsiveFontSizes = responsiveFontSizes(theme);

export default themeWithResponsiveFontSizes;
