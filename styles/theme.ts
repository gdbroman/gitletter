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
      fontSize: "53px",
    },
    h2: {
      fontSize: "42px",
    },
    h3: {
      fontSize: "36px",
    },
    h4: {
      fontSize: "24px",
    },
    h5: {
      fontSize: "20px",
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
    },
  },
});

const themeWithResponsiveFontSizes = responsiveFontSizes(theme);

export default themeWithResponsiveFontSizes;
