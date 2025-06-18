import { useAuth } from "@/store/AuthContext/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: any) {
  const { loginData }: any = useAuth();
  if (loginData) {
    return children;
  } else {
    return <Navigate to="/login" replace />;
  }
}
