import { useAuth } from "@/store/AuthContext/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: any) {
  const { loginData, isLoading }: any = useAuth();

  // If loading, show a loader or spinner

  if (isLoading)
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 text-lg font-medium tracking-wide">
          Please wait, loading...
        </p>
      </div>
    </div>;

  if (loginData) {
    return children;
  } else {
    return <Navigate to="/login" replace />;
  }
}
