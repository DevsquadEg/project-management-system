import { USERS_URL } from "@/service/api.js";
import { axiosInstance } from "@/service/urls.js";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import SubmitBtn from "@/components/auth/SubmitBtn";
import type { ChangePassword } from "@/interfaces/interfaces";
import validation from "@/service/validation";
import { isAxiosError } from "axios";

export default function ChangePassword() {
  const [isFirstPassVisible, setIsFirstPassVisible] = useState(false); // eye flash old password
  const [isSecondPassVisible, setIsSecondPassVisible] = useState(false); // eye flash new and confirm password

  const navigate = useNavigate();

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    watch,
    trigger,
  } = useForm<ChangePassword>({ mode: "onChange" }); // (mode) to make it real time match error (trigger) to trag between password and confirm password

  // =========== Change Password ========
  const onChangePass = async (data: ChangePassword) => {
    try {
      let response = await axiosInstance.put(USERS_URL.CHANGE_PASSWORD, data);
      // console.log(response);

      navigate("/dashboard");
      toast.success(
        response?.data?.message || "Password has been updated successfully!"
      );
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message || "Invalid Password");
      }
      // console.log(error);
    }
  };

  useEffect(() => {
    if (watch("confirmNewPassword")) {
      trigger("confirmNewPassword"); // This will trigger validation for confirmNewPassword whenever it changes
    }
  }, [watch, trigger]);

  return (
    <>
      <div className="container  changePassBg rounded-3 shadow-lg p-5 mt-5 ">
        <form onSubmit={handleSubmit(onChangePass)} className="text-start">
          <div className="text-start mb-4">
            <small className="text-white">welcome to PMS</small>
            <div className="hello">
              <h1 className="section-title fw-bold m-0 section-title">
                Change Password
              </h1>
            </div>
          </div>

          {/* UI Old Password*/}
          <div className="mb-3">
            {/* label  */}
            <label htmlFor="Passeword" className="form-label  fw-normal ">
              Old Password
            </label>
            <div className="border-bottom d-flex align-items-center pb-1">
              <div className="input-group">
                {/* input */}
                <input
                  type={isFirstPassVisible ? "text" : "password"}
                  placeholder="Enter your Old Password"
                  className="form-control custom-input"
                  {...register(
                    "oldPassword",
                    validation.PASSWORD_VALIDATION("password is required")
                  )}
                />
                {/* show password icon  */}
                <button
                  type="button"
                  onClick={() => setIsFirstPassVisible((prev) => !prev)}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseUp={(e) => e.preventDefault} // to prevent the feature of unfocus when i click on the icon
                  className="input-group-text btnSlash"
                  id="addon-wrapping"
                >
                  <i
                    className={`fa-regular ${
                      isFirstPassVisible ? "fa-eye " : "fa-eye-slash"
                    }`}
                  ></i>
                </button>
              </div>
            </div>
            {errors.oldPassword && (
              <span className="text-danger ps-1">
                {errors.oldPassword.message}
              </span>
            )}
          </div>

          {/*  UI New Password  */}
          <div className="mb-3">
            {/* label  */}
            <label htmlFor="password" className="form-label  fw-normal">
              New Password
            </label>
            <div className="border-bottom d-flex align-items-center pb-1">
              <div className="input-group">
                {/* input */}
                <input
                  type={isSecondPassVisible ? "text" : "password"}
                  placeholder="Enter Your New Password"
                  {...register(
                    "newPassword",
                    validation.PASSWORD_VALIDATION("Password is required")
                  )}
                  className="form-control custom-input
                  "
                />
                {/* show password icon  */}
                <button
                  type="button"
                  onClick={() => setIsSecondPassVisible((prev) => !prev)}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseUp={(e) => e.preventDefault} // to prevent the feature of unfocus when i click on the icon
                  className="input-group-text btnSlash"
                  id="addon-wrapping"
                >
                  <i
                    className={`fa-regular ${
                      isSecondPassVisible ? "fa-eye " : "fa-eye-slash"
                    }`}
                  ></i>
                </button>
              </div>
            </div>
            {errors.newPassword && (
              <span className="text-danger ps-1">
                {errors.newPassword.message}
              </span>
            )}
          </div>

          {/* UI Confirm Password  */}
          <div className="mb-3">
            {/* label  */}
            <label htmlFor="password" className="form-label  fw-normal">
              Confirm New Password
            </label>
            <div className="border-bottom d-flex align-items-center pb-1">
              <div className="input-group  ">
                {/* input */}
                <input
                  type={isSecondPassVisible ? "text" : "password"}
                  placeholder="Enter Your New Password"
                  {...register(
                    "confirmNewPassword", // validtion for confirm password
                    {
                      required: "Confirm New Password is Required",
                      validate: (value) =>
                        value === watch("newPassword") ||
                        "Passwords do not match", //match passowrd and confirm password
                    }
                  )}
                  className="form-control custom-input
                  "
                />
                {/* show password icon  */}
                <button
                  type="button"
                  onClick={() => setIsSecondPassVisible((prev) => !prev)}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseUp={(e) => e.preventDefault} // to prevent the feature of unfocus when i click on the icon
                  className="input-group-text btnSlash"
                  id="addon-wrapping"
                >
                  <i
                    className={`fa-regular ${
                      isSecondPassVisible ? "fa-eye " : "fa-eye-slash"
                    }`}
                  ></i>
                </button>
              </div>
            </div>
            {errors.confirmNewPassword && (
              <span className="text-danger ps-1 ">
                {errors.confirmNewPassword.message}
              </span>
            )}
          </div>

          {/* Submit */}
          <div className="d-grid ">
            <SubmitBtn isSubmitting={isSubmitting} title="Update Password" />
          </div>
        </form>
      </div>
    </>
  );
}
