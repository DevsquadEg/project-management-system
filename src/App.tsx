import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout/AuthLayout";
import NotFound from "./Pages/NotFound/NotFound";
import Login from "./Pages/Auth/Login/Login";
import Register from "./Pages/Auth/Register/Register";
import ResetPassword from "./Pages/Auth/ResetPassword/ResetPassword";
import ForgetPassword from "./Pages/Auth/ForgetPassword/ForgetPassword";
import ChangePassword from "./Pages/Auth/ChangePassword/ChangePassword";
import VerifyEmail from "./Pages/Auth/VerifyEmail/VerifyEmail";
import MasterLayout from "./layouts/MasterLayout/MasterLayout";
import Dashboard from "./Pages/Dashbaord/Dashboard";
import AllProjects from "./Pages/Manager/Projects/allProjects/AllProjects";
import AllTasks from "./Pages/Manager/Tasks/AllTasks/AllTasks";
import MyTasks from "./Pages/Employee/MyTasks/MyTasks";
import Users from "./Pages/Manager/users/Users";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import ProjectForm from "./Pages/Manager/Projects/ProjectForm/ProjectForm";
import ProjectsSystem from "./Pages/Manager/Projects/ProjectsSystem/ProjectsSystem";
import Profile from "./components/profile/Profile";
import TaskForm from "./Pages/Manager/Tasks/TaskForm/TaskForm";
import TaskDetails from "./Pages/Manager/Tasks/TaskDetails/TaskDetails";
import GustRoute from "./components/gustRoute/GustRoute";
import { HelmetProvider } from "react-helmet-async";
const helmetContext = {};

function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: (
        <GustRoute>
          <AuthLayout />
        </GustRoute>
      ),
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Login /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "reset-password", element: <ResetPassword /> },
        { path: "forget-password", element: <ForgetPassword /> },
        { path: "verify-account", element: <VerifyEmail /> },
      ],
    },
    {
      path: "",
      element: (
        <ProtectedRoute>
          <MasterLayout />
        </ProtectedRoute>
      ),
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: "dashboard", element: <Dashboard /> },

        // Manager routes
        { path: "projects-system", element: <ProjectsSystem /> },
        { path: "projects-manage", element: <AllProjects /> },
        { path: "projects/add", element: <ProjectForm /> },
        { path: "projects/edit/:id", element: <ProjectForm /> },
        { path: "tasks", element: <AllTasks /> },
        { path: "tasks/add", element: <TaskForm /> },
        { path: "tasks/edit/:id", element: <TaskForm /> },
        { path: "tasks/:id", element: <TaskDetails /> },
        { path: "users", element: <Users /> },
        { path: "change-password", element: <ChangePassword /> },

        { path: "profile", element: <Profile /> },

        // Employee routes

        { path: "my-tasks", element: <MyTasks /> },
      ],
    },
  ]);

  return (
    <>
      <HelmetProvider context={helmetContext}>
        <RouterProvider router={routes}></RouterProvider>
      </HelmetProvider>
      <Toaster />
    </>
  );
}

export default App;
