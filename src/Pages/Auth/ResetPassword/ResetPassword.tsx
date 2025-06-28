import validation from "@/service/validation";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { axiosInstance } from "@/service/urls";
import { USERS_URL } from "@/service/api";
import SubmitBtn from "@/components/auth/SubmitBtn";
import { isAxiosError } from "axios";

type ResetPassInputs = {
  email: string;
  seed: string;
  password: string;
  confirmPassword: string;
};

export default function ResetPassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isPassVisible, setIsPassVisible] = useState(false);
  const location = useLocation();
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    trigger,
    formState: { errors, isSubmitted },
  } = useForm<ResetPassInputs>();

  if (location.state?.email) {
    setValue("email", location.state?.email);
  }

  // =========== submit login ========
  const onSubmit = async (data: ResetPassInputs) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(USERS_URL.RESET, data);

      toast.success(
        response?.data?.message || "Password has been reset successfully!"
      );
      navigate("/login", { state: { email: data.email } });
    } catch (error) {
      // console.log(error);
      if (isAxiosError(error))
        toast.error(error?.response?.data?.message || "Something went wrong");
    }
    setIsLoading(false);
  };
  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="d-flex flex-column gap-4"
      >
        <div className="d-flex flex-column gap-1 ">
          <small className="text-white">welcome to PMS</small>
          <h1 className="section-title">Reset Password</h1>
        </div>

        {/* E-mail */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label fw-normal">
            E-mail
          </label>

          <div className="border-bottom d-flex align-items-center pb-1">
            <div className="input-group">
              <input
                id="email"
                type="email"
                placeholder="Enter your E-mail"
                disabled={location.state?.email}
                {...register("email", validation.EMAIL_VALIDATION)}
                className="form-control custom-input"
              />
            </div>
          </div>
          <span className="text-danger">{errors.email?.message}</span>
        </div>
        {/* OTP */}
        <div className="mb-3">
          <label htmlFor="seed" className="form-label fw-normal">
            OTP Verification
          </label>

          <div className="border-bottom d-flex align-items-center pb-1">
            <div className="input-group">
              <input
                id="seed"
                type="text"
                placeholder="Enter Verification"
                {...register("seed", {
                  required: "OTP is required",
                })}
                className="form-control custom-input"
              />
            </div>
          </div>
          <span className="text-danger">{errors.seed?.message}</span>
        </div>
        {/* New Password */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label fw-normal">
            New Password
          </label>

          <div className="border-bottom d-flex align-items-center pb-1">
            <div className="input-group">
              <input
                id="password"
                type={isPassVisible ? "text" : "password"}
                placeholder="Password"
                {...register(
                  "password",
                  validation.PASSWORD_VALIDATION("New Password is Required")
                )}
                onChange={(e) => {
                  register("password").onChange(e);

                  if (isSubmitted) {
                    trigger("confirmPassword");
                  }
                }}
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
          <span className="text-danger">{errors.password?.message}</span>
        </div>
        {/* Confirm Password */}
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label fw-normal">
            Confirm Password
          </label>

          <div className="border-bottom d-flex align-items-center pb-1">
            <div className="input-group">
              <input
                id="confirmPassword"
                type={isPassVisible ? "text" : "password"}
                placeholder="Password"
                {...register(
                  "confirmPassword",
                  validation.CONFIRM_PASSWORD_VALIDATION(getValues, "password")
                )}
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
          <span className="text-danger">{errors.confirmPassword?.message}</span>
        </div>

        {/* Submit */}
        <div className="d-grid">
          <SubmitBtn isSubmitting={isLoading} title="Reset Password" />
        </div>
      </form>
    </>
  );
}
