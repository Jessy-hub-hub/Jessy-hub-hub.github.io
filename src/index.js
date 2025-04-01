// src/index.js

import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import { BrowserRouter, useNavigate, useLocation } from "react-router-dom";
import App from "./App";
import client from "./graphql/apolloClient";

// RedirectHandler Component: Handles redirect query parameters
const RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const redirectPath = urlParams.get("redirect");

    if (redirectPath) {
      // Navigate to the decoded redirect path and remove query param
      navigate(decodeURIComponent(redirectPath), { replace: true });
    }
  }, [navigate, location]);

  return null;
};

// Root Rendering
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <RedirectHandler />
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);
