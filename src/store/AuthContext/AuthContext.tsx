import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export default function AuthProvider({ children }: any) {
  const [loginData, setLoginData] = useState<any>(null);

  const saveLoginData: any = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded: any = jwtDecode(token);
        setLoginData(decoded);
        console.log(decoded);
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
