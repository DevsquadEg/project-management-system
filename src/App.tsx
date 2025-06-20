import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout/AuthLayout.tsx";
import NotFound from "./Pages/NotFound/NotFound.tsx";
import Login from "./Pages/Auth/Login/Login.tsx";
import Register from "./Pages/Auth/Register/Register.tsx";
import ResetPassword from "./Pages/Auth/ResetPassword/ResetPassword.tsx";
import ForgetPassword from "./Pages/Auth/ForgetPassword/ForgetPassword.tsx";
import ChangePassword from "./Pages/Auth/ChangePassword/ChangePassword.tsx";
import VerifyEmail from "./Pages/Auth/VerifyEmail/VerifyEmail.tsx";
import MasterLayout from "./layouts/MasterLayout/MasterLayout.tsx";
import Dashboard from "./Pages/Dashbaord/Dashboard.tsx";
import AllProjects from "./Pages/Manager/Projects/allProjects/AllProjects.tsx";
import AllTasks from "./Pages/Manager/Tasks/AllTasks/AllTasks.tsx";
import MyProjects from "./Pages/Employee/MyProjects/MyProjects.tsx";
import MyTasks from "./Pages/Employee/MyTasks/MyTasks.tsx";
import Users from "./Pages/Manager/users/Users.tsx";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute.tsx";
import ProjectForm from "./Pages/Manager/Projects/ProjectForm/ProjectForm.tsx";
import ProjectsSystem from "./Pages/Manager/Projects/ProjectsSystem/ProjectsSystem.tsx";

function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <AuthLayout />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Login /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "reset-password", element: <ResetPassword /> },
        { path: "forget-password", element: <ForgetPassword /> },
        { path: "change-password", element: <ChangePassword /> },
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
        { path: "users", element: <Users /> },

        // Employee routes
        { path: "my-projects", element: <MyProjects /> },
        { path: "my-tasks", element: <MyTasks /> },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={routes}></RouterProvider>
      <Toaster />
    </>
  );
}

export default App;
