import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import type { FormInfoVerifyProps } from "../../../interfaces/interfaces";

import { USERS_URL } from "@/service/api";
import { axiosInstance } from "@/service/urls";
import validation from "@/service/validation";
import SubmitBtn from "@/components/auth/SubmitBtn";

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
                toast.error(
                    error?.response?.data.message || "Something went wrong!"
                );
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
  <header className="mt-3">
    <p className="mb-0 text-white small-welcome">Welcome to PMS</p>
    <h1 id="verify-heading" className="h4 fw-bold text-orange">
      Verify Account
    </h1>
  </header>

  <form
    className="row mt-2 py-3"
    onSubmit={handleSubmit(verificationAccount)}
    noValidate
    aria-labelledby="verify-heading"
  >
    <fieldset className="col-md-8">
      <legend className="visually-hidden">Verification Information</legend>

      {/* Email Input */}
      <div className="mb-3">
        <label htmlFor="email" className="d-block text-orange">
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
          className="border-0 border-1 border-bottom bg-transparent p-1 full-width no-outline text-white"
          placeholder="Enter Your Email"
          aria-invalid={errors.email ? "true" : "false"}
          aria-required="true"
          aria-describedby="email-error"
        />
        {errors.email && (
          <p id="email-error" className="text-white small-alert" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* OTP Input */}
      <div className="mb-3">
        <label htmlFor="otp" className="d-block text-orange">
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
          className="border-0 border-1 border-bottom bg-transparent p-1 full-width no-outline text-white"
          placeholder="Enter Your OTP"
          aria-invalid={errors.code ? "true" : "false"}
          aria-required="true"
          aria-describedby="otp-error"
        />
        {errors.code && (
          <p id="otp-error" className="text-white small-alert" role="alert">
            {errors.code.message}
          </p>
        )}
      </div>
    </fieldset>

    {errorMessage && (
      <p className="text-center text-white mt-2" role="alert">
        {errorMessage}
      </p>
    )}

    <SubmitBtn isSubmitting={isSubmitting} title="Verify" />
  </form>
</main>


    );
}
