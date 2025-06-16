/* eslint-disable react-refresh/only-export-components */
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { AuthContextType, DecodedTokenPayload } from "../../interfaces/interfaces";

const AuthContext = createContext<AuthContextType| undefined>(undefined);

export default function AuthProvider({ children }:{children:ReactNode}) {
  const [loginData, setLoginData] = useState<DecodedTokenPayload | null>(null);

  const saveLoginData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode<DecodedTokenPayload>(token);
        setLoginData(decoded);
      }
    } catch (err) {
      console.error("Invalid token", err);
      localStorage.removeItem("token");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      saveLoginData();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ loginData, setLoginData, saveLoginData }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
