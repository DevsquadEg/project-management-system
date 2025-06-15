import { USERS_URL } from "../../../service/api.js";
import { axiosInstance } from "../../../service/urls.js";

import { useForm } from "react-hook-form";
import { useAuth } from "../../../store/AuthContext/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const { saveLoginData }: any = useAuth();
  const [isPassVisible, setIsPassVisible] = useState(false); // eye flash old password
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
      <form onSubmit={handleSubmit(onSubmit)} className="text-start">
        <div className="d-flex flex-column gap-1 mb-5 ">
          <small className="text-white">welcome to PMS</small>
          <h2 className="section-title">Login</h2>
        </div>

        {/* E-mail */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label text-warning fw-normal">
            E-mail
          </label>

          <div className="border-bottom d-flex align-items-center pb-1">
            <div className="input-group">
              <input
                id="email"
                type="email"
                placeholder="Enter your E-mail"
                {...register("email", { required: "Email is required" })}
                className="form-control custom-input"
              />
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="mb-3">
          <label
            htmlFor="password"
            className="form-label text-warning fw-normal"
          >
            Password
          </label>

          <div className="border-bottom d-flex align-items-center pb-1">
            <div className="input-group">
              <input
                id="password"
                type={isPassVisible ? "text" : "password"}
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                })}
                className="form-control custom-input "
              />
              <button
                type="button"
                onClick={() => setIsPassVisible((prev) => !prev)}
                onMouseDown={(e) => e.preventDefault()}
                onMouseUp={(e) => e.preventDefault} // to prevent the feature of unfocus when i click on the icon
                className="input-group-text btnSlash"
                id="addon-wrapping"
              >
                <i
                  className={`fa-regular ${
                    isPassVisible ? "fa-eye " : "fa-eye-slash"
                  }`}
                ></i>
              </button>
            </div>
          </div>
        </div>
        <div className="links d-flex justify-content-between my-4  ">
          <Link
            className=" text-white text-decoration-none fw-light"
            to="/register"
          >
            Register Now?
          </Link>
          <Link
            className="text-white text-decoration-none fw-light "
            to="/forget-password"
          >
            Forgot Password?
          </Link>
        </div>
        {/* Submit */}
        <div className="d-grid">
          <button
            type="submit"
            className="btn custom-btn btn-lg "
            disabled={isSubmitting}
          >
            Login
          </button>
        </div>
      </form>
    </>
  );
}
