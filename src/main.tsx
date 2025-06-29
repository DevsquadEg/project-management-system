import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import App from "./App";
import "./index.css";
import AuthProvider from "./store/AuthContext/AuthContext";
import ModeProvider from "./store/ModeContext/ModeContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ModeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ModeProvider>
  </StrictMode>
);
