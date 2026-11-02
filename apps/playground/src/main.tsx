import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@brahmastra/tokens/css";
import "@brahmastra/tokens/typography";
import "./playground.css";
import { App } from "./App.tsx";

// The component styles come straight from packages/ui/src/css, in order, so they hot-reload.
import.meta.glob("../../../packages/ui/src/css/*.css", { eager: true });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
