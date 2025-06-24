import type { Dispatch, SetStateAction } from "react";

// login interface
export interface FormLoginProps {
  email: string;
  password: string;
}

// Register interfaces
export interface FormInfo {
  userName: string;
  email: string;
  password: string;
  country: string;
  phoneNumber: string;
  confirmPassword: string;
}

// Auth Context interfaces

export interface AuthContextType {
  loginData: DecodedTokenPayload | null;
  setLoginData: React.Dispatch<
    React.SetStateAction<DecodedTokenPayload | null>
  >;
  saveLoginData: () => Promise<void>;
  isLoading: boolean;
  fullUserData: any;
  setFullUserData: React.Dispatch<React.SetStateAction<any>>;
  getCurrentUser: () => Promise<void>;
  logOutUser: () => void;
}

export interface ModeContextType {
  darkMode: boolean;
  setDarkMode: Dispatch<SetStateAction<boolean>>;
}

export interface DecodedTokenPayload {
  exp: number; // Expiration time (Unix timestamp)
  iat: number; // Issued at time (Unix timestamp)
  roles: string[]; // Array of user roles/permissions
  userEmail: string; // User's email
  userGroup: string; // User group (e.g., "Employee")
  userId: number; // Unique user ID
  userName: string; // Username
}

// verify account

export interface FormInfoVerifyProps {
  email: string;
  code: string;
}

export const PROJECT_URLS = {
  GET_PROJECT_BY_ID: (id: number) => `/Project/${id}`,
  CREATE_PROJECT: "/Project",
  UPDATE_PROJECT: (id: number) => `/Project/${id}`,
};
