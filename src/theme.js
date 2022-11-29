import { createTheme } from "@mui/material/styles";
import { grey, purple } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    background: {
      default: "#121212",
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
    button: {
      primary: "#ffffff",
    },
    primary: purple,
    secondary: grey,
  },
});

export default theme;
