import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./forgetPassword.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import validation from "@/service/validation";
import { axiosInstance } from "@/service/urls";
import { USERS_URL } from "@/service/api";
import SubmitBtn from "@/components/auth/SubmitBtn";

export default function ForgetPassword() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // =========== submit login ========
    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            const response: any = await axiosInstance.post(
                USERS_URL.RESET_REQUEST,
                data
            );

            toast.success(
                "Reset OTP sent Successfully, Please check your Email!"
            );
            navigate("/reset-password", { state: { email: data.email } });
        } catch (error) {
            console.log(error);
            toast.error(
                error?.response?.data?.message || "Something went wrong"
            );
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
                    <h2 className="section-title">Forget Password</h2>
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
                                {...register(
                                    "email",
                                    validation.EMAIL_VALIDATION
                                )}
                                className="form-control custom-input"
                            />
                        </div>
                    </div>
                    <span className="text-danger">{errors.email?.message}</span>
                </div>
                {/* Submit */}
                <div className="d-grid">
                    <SubmitBtn
                        isSubmitting={isLoading}
                        title="Update Password"
                    />
                </div>
            </form>
        </>
    );
}
