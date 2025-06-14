import { USERS_URL } from "../../../service/api.js"; // عدّل حسب المسار
import { axiosInstance } from "../../../service/urls.js";

import { useForm } from "react-hook-form";
import { useAuth } from "../../../store/AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// import {axiosInstance} from ""
export default function Login() {
  const navigate = useNavigate();
  const { saveLoginData }: any = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // =========== submit login ========
  const onSubmit = async (data: any) => {
    try {
      const response: any = await axiosInstance.post(USERS_URL.LOGIN, data);
      localStorage.setItem("token", response.data.token);
      await saveLoginData();
      toast.success("Login success!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <>
      <div className="auth-container w-100 vh-100 bg-info">
        <div className="container-fluid">
          <div className="w-100 py-5 d-flex justify-content-center">
            <img className="" src="/pmsLogo.svg" alt="pmslogo" />
          </div>
          <div className="row justify-content-center align-items-center">
            <div className="col-md-10 col-lg-6 px-sm-4 px-md-5 py-4 auth-area rounded">
              <form onSubmit={handleSubmit(onSubmit)} className="text-start">
                <div className="text-start mb-4">
                  <small className="text-white">welcome to PMS</small>
                  <h2 className="text-warning fw-bold m-0">Login</h2>
                </div>

                {/* E-mail */}
                <div className="mb-3">
                  <label
                    htmlFor="email"
                    className="form-label text-warning fw-normal"
                  >
                    E-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your E-mail"
                    {...register("email", { required: "Email is required" })}
                    className="form-control "
                  />
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label
                    htmlFor="password"
                    className="form-label text-warning fw-normal"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                    className="form-control  "
                    style={{ backgroundColor: "black", color: "white" }}
                  />
                </div>

                {/* Submit */}
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
