import { type ReactNode } from "react";

import { Navigate } from "react-router-dom";

export default function GustRoute({ children }: { children: ReactNode }) {
  if (localStorage.getItem("token")) {
    // If user is already logged in, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  } else {
    return children;
  }
}
