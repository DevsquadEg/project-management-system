import type { AuthContextType } from "@/interfaces/interfaces";
import { useAuth } from "@/store/AuthContext/AuthContext";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { loginData, isLoading }: AuthContextType = useAuth();

  // If loading, show a loader or spinner

  if (isLoading)
    return (
      <div className="w-100 text-center d-flex justify-content-center align-items-center vh-100">
        <i className="fa fa-spinner fa-spin fa-5x"></i>
      </div>
    );

  if (loginData) {
    return children;
  } else {
    return <Navigate to="/login" replace />;
  }
}
