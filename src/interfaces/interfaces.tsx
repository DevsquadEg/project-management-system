import type { Dispatch, SetStateAction } from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";

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
  profileImage: File | null;
}

// Auth Context interfaces

export type FullUserDataType = {
  id: number;
  userName: string;
  email: string;
  phoneNumber: string;
  country: string;
  imagePath: string | null;
  isActivated: boolean;
  isVerified: boolean;
  creationDate: string;
  modificationDate: string;
  group: {
    name: string;
    id: number;
  };
};

export interface AuthContextType {
  loginData: DecodedTokenPayload | null;
  setLoginData: React.Dispatch<
    React.SetStateAction<DecodedTokenPayload | null>
  >;
  saveLoginData: () => Promise<void>;
  isLoading: boolean;
  fullUserData: FullUserDataType | null;
  setFullUserData: React.Dispatch<
    React.SetStateAction<FullUserDataType | null>
  >;
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

export type UserType = {
  country: string;
  creationDate: string | number | Date;
  email: string;
  id: number;
  imagePath: string;
  isActivated: boolean;
  modificationDate: string | number | Date;
  phoneNumber: string;
  userName: string;
  group: {
    name: string;
  };
};

export type ProjectType = {
  id: number;
  title: string;
  description: string;
  creationDate: string;
  modificationDate: string;
  task: TaskType[];
  manager: UserType;
};

export type TaskType = {
  creationDate: string;
  description: string;
  employee: UserType;
  id: number;
  modificationDate: string;
  project: ProjectType;
  status: "ToDo" | "InProgress" | "Done";
  title: string;
};

export type ProjectSelectProps = {
  register: UseFormRegister<TaskFormInputs>;
  errors: TaskErrorObject;
  task?: TaskType;
  projectsList: ProjectType[];
  projectsHasMore: boolean;
  fetchMoreProjects: () => void;
};

export type UsersSelectProps = {
  register: UseFormRegister<TaskFormInputs>;
  errors: TaskErrorObject;
  task?: TaskType;
  usersList: UserType[];
  usersHasMore: boolean;
  fetchMoreUsers: () => void;
};

export type TaskFormInputs = {
  title: string;
  description: string;
  employeeId: string;
  projectId: string;
};

// Auth changepass interfaces
export interface ChangePassword {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
}

export interface Column {
  id: string;
  title: string;
  status: "ToDo" | "InProgress" | "Done";
}

export interface TasksState {
  data: Record<string, TaskType[]>;
  dataLength: number;
  columns: Column[];
  columnOrder: string[];
}

export type TaskErrorObject = FieldErrors<TaskFormInputs>;

export interface AxiosErrorResponse {
  response: {
    data: {
      message: string;
    };
  };
}

// =================

export type UserFormInputs = {
  userName: string;
  email: string;
  country: string;
  phoneNumber: string;
  confirmPassword: string;
  profileImage: File[] | null;
};
