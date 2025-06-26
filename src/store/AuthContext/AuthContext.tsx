/* eslint-disable react-refresh/only-export-components */
import { jwtDecode } from "jwt-decode";
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import type {
    AuthContextType,
    DecodedTokenPayload,
    FullUserDataType,
} from "../../interfaces/interfaces";
import { USERS_URL } from "@/service/api";
import { axiosInstance } from "@/service/urls";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [loginData, setLoginData] = useState<DecodedTokenPayload | null>(
        null
    );
    const [isLoading, setIsLoading] = useState(true);
    const [fullUserData, setFullUserData] = useState<FullUserDataType  | null>(null);

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
        } finally {
            setIsLoading(false); // stop loading whether success or fail
        }
    };

    const getCurrentUser = async () => {
        try {
            const res = await axiosInstance.get(USERS_URL.GET_CURRENT_USER);
            setFullUserData(res.data);
            console.log("userData", res.data);
        } catch (err) {
            console.error("Failed to fetch user data", err);
        }
    };

    useEffect(() => {
        if (localStorage.getItem("token")) {
            saveLoginData();
            getCurrentUser();
        } else {
            setLoginData(null);
            setIsLoading(false); // no token, stop loading anyway
        }
    }, []);

    const logOutUser = () => {
        localStorage.removeItem("token");
        saveLoginData();
        setFullUserData(null);
    };

    return (
        <AuthContext.Provider
            value={{
                loginData,
                setLoginData,
                saveLoginData,
                isLoading,
                setFullUserData,
                fullUserData,
                getCurrentUser,
                logOutUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};