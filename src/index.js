import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/system";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import theme from "./theme";
import client from "./graphql/client";
import { ApolloProvider } from "@apollo/client";

const root = createRoot(document.getElementById("root"));
root.render(
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </ApolloProvider>
);
