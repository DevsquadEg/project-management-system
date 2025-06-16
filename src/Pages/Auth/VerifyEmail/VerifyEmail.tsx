import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import type { FormInfoVerifyProps } from "../../../interfaces/interfaces";

import { USERS_URL } from "@/service/api";
import { axiosInstance } from "@/service/urls";
import validation from "@/service/validation";

export default function VerifyEmail() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormInfoVerifyProps>({
    mode: "onChange",
    defaultValues: { email: location.state.email },
  });

  async function verificationAccount(info: FormInfoVerifyProps) {
    const toastId = toast.loading("Waiting....");

    try {
      const options = {
        url: USERS_URL.VERIFY_ACCOUNT,
        method: "PUT",
        data: info,
      };
      const { data } = await axiosInstance.request(options);
      if (data.message === "Account verified successfully") {
        setErrorMessage(null);
        toast.success(data.message || "Account created successfully.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data.message || "Something went wrong!");
        setErrorMessage(
          error.response?.data.message || "Something went wrong!"
        );
      }
    } finally {
      toast.dismiss(toastId);
    }
  }

  return (
    <main className="rounded-2 py-2 px-4" role="main">
      <section aria-labelledby="verify-heading" className="text mt-3">
        <p className="mb-0 text-white" style={{ fontSize: 10 }}>
          Welcome to PMS
        </p>
        <h1
          id="verify-heading"
          className="h4 fw-bold"
          style={{ color: "#EF9B28" }}
        >
          Verify Account
        </h1>
      </section>

      <form
        className="row mt-2 py-3"
        onSubmit={handleSubmit(verificationAccount)}
        noValidate
      >
        <div className="col-md-8">
          {/* Email Input */}
          <div className="mb-3">
            <label
              htmlFor="email"
              style={{ color: "#EF9B28" }}
              className="d-block"
            >
              E-mail
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: validation.EMAIL_VALIDATION,
                  message: "Email must be valid",
                },
              })}
              id="email"
              type="email"
              className="border-0 border-1 border-bottom bg-transparent p-1"
              style={{ outline: 0, width: "100%" }}
              placeholder="Enter Your Email"
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby="email-error"
            />
            {errors.email && (
              <p
                id="email-error"
                className="text-white"
                style={{ fontSize: 12 }}
                role="alert"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          {/* OTP Input */}
          <div className="mb-3">
            <label
              htmlFor="otp"
              style={{ color: "#EF9B28" }}
              className="d-block"
            >
              OTP Validation
            </label>
            <input
              {...register("code", {
                required: "OTP is required",
                minLength: {
                  value: 4,
                  message: "OTP must be 4 characters long",
                },
                maxLength: {
                  value: 4,
                  message: "OTP only 4 characters long",
                },
              })}
              id="otp"
              type="text"
              className="border-0 border-1 border-bottom bg-transparent p-1"
              style={{ outline: 0, width: "100%" }}
              placeholder="Enter Your OTP"
              aria-invalid={errors.code ? "true" : "false"}
              aria-describedby="otp-error"
            />
            {errors.code && (
              <p
                id="otp-error"
                className="text-white"
                style={{ fontSize: 12 }}
                role="alert"
              >
                {errors.code.message}
              </p>
            )}
          </div>
        </div>

        {errorMessage && (
          <p className="text-center text-white mt-2" role="alert">
            {errorMessage}
          </p>
        )}

        <button disabled={isSubmitting} className="btn custom-btn btn-lg mt-3">
          {isSubmitting ? (
            <i className="fa-solid fa-spinner fa-spin"></i>
          ) : (
            "Save"
          )}
        </button>
      </form>
    </main>
  );
}
