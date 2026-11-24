import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import "./i18n";
import "./styles.css";
import "./themes.css";
import "./roadmap.css";
import "./brand.css";
import "./cinematic.css";
import "./sections.css";
import "./chrome.css";
import "./fab.css";
import "./campus.css";
import "./flow.css";
import "./books.css";
import "./glass.css";
import "./light.css";
import App from "./App";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </BrowserRouter>
  </React.StrictMode>,
);
