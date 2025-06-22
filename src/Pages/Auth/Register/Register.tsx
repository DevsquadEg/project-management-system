import { useForm } from "react-hook-form";
import { useCallback, useEffect, useRef, useState } from "react";
import { countries } from "countries-list";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import type { FormInfo } from "@/interfaces/interfaces";
import { USERS_URL } from "@/service/api";
import { axiosInstance } from "@/service/urls";
import validation from "@/service/validation";
import SubmitBtn from "@/components/auth/SubmitBtn";
import avatar from "../../../assets/register-img.png"

const countriesList = Object.values(countries)
  .map((country) => ({
    Countryname: country.name,
    countryPhone: country.phone[0],
  }))
  .sort((a, b) => a.Countryname.localeCompare(b.Countryname));

export default function Register() {
  const [phonePrefix, SetphonePrefix] = useState<string | number>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null)
const [reviewImage , setReviewImage] = useState< string | null>(null)

  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    watch,
    trigger,
    setValue
  } = useForm<FormInfo>({ mode: "onChange", defaultValues: { country: "" } });



function convertValuesIntoForm(data:FormInfo){
  const formData = new FormData()
  formData.append('userName', data.userName)
  formData.append('email', data.email)
  formData.append('password', data.password)
  formData.append('confirmPassword', data.confirmPassword)
  formData.append('country', data.country)
  formData.append('phoneNumber', data.phoneNumber)
  if(data.profileImage){
     formData.append('profileImage', data.profileImage)
  }
  return formData

}








  async function registerEmploye(info: FormInfo) {

    const convertedData = convertValuesIntoForm(info)
    const toastId = toast.loading("Waiting....");
    try {
      const options = {
        url: USERS_URL.REGISTER,
        method: "POST",
        data: convertedData,
      };
      const { data } = await axiosInstance.request(options);
      if (
        data.message ===
        "Account created successfully. A verification code has been sent to your email address."
      ) {
        setErrorMessage(null);
        toast.success(data.message);
        setTimeout(() => {
          navigate("/verify-account", {
            state: { email: watch("email") },
          });
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

  useEffect(() => {
    const subscription = watch((_, { name }) => {
      if (name === "password") trigger("confirmPassword");
    });
    return () => subscription.unsubscribe();
  }, [watch, trigger]);

  const selectedCountry = watch("country");

  const handleChangePrefix = useCallback(() => {
    const phone = countriesList.find(
      (pre) => pre.Countryname === selectedCountry
    );
    SetphonePrefix(phone ? phone.countryPhone : "");
  }, [selectedCountry]);

  useEffect(() => {
    handleChangePrefix();
  }, [selectedCountry, handleChangePrefix]);



// handle upload photo


function handleClickImg(){
  fileInputRef.current?.click()
}

// Update preview when user selects a new image

const watchImage = watch("profileImage");

useEffect(() => {
  if (watchImage instanceof File) {
    const previewUrl = URL.createObjectURL(watchImage);
    setReviewImage(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }
}, [watchImage]);











  return (
    <>
      <form
        className="row mt-2 py-3"
        onSubmit={handleSubmit(registerEmploye)}
        noValidate
      >
        
        <div className="d-flex flex-column gap-1 mb-5 ">
          <small className="text-white">Welcome to PMS</small>
          <div className=" w-50 d-flex justify-content-between">

          <h2 className="section-title"> Create New Account</h2>

           <div className="img rounded-circle  " style={{width:60 , height:60,}}>
            <img className="rounded-circle" onClick={handleClickImg} src={ reviewImage || avatar} alt="avatar-imge" style={{width:60 , height:60,}} />
            <input
            {...register("profileImage",{
              onChange(e) {
                const file = e.target.files[0]
              setValue("profileImage", file);
              },
            })}
            
            accept="image/*"  ref={fileInputRef} type="file"  placeholder="hello" style={{appearance:"none",display:"none"}}/>
           </div>

          </div>
        </div>



        
        {/* Left Column */}
        <fieldset className="col-md-6">
          <legend className="visually-hidden">Personal Details</legend>
          {/* UserName */}
          <div className="mb-3">
            <label
              htmlFor="userName"
              className="d-block"
              style={{ color: "#EF9B28" }}
            >
              User Name
            </label>
            <input
              {...register("userName", {
                required: "User Name Is Required",
                minLength: {
                  value: 4,
                  message: "Minimum 4 characters",
                },
                maxLength: {
                  value: 8,
                  message: "Maximum 8 characters",
                },
                pattern: {
                  value: /^[A-Za-z]+[A-Za-z0-9]*\d$/,
                  message: "Must end with numbers without spaces",
                },
              })}
              id="userName"
              type="text"
              placeholder="Enter Your Name"
              className=" custom-input border-bottom border-0 border-1 border-bottom bg-transparent p-1 w-100"
              style={{ outline: 0 }}
              aria-invalid={!!errors.userName}
              aria-describedby="userName-error"
            />
            {errors.userName && (
              <p
                id="userName-error"
                className="text-danger"
                role="alert"
                style={{ fontSize: 12 }}
              >
                {errors.userName.message}
              </p>
            )}
          </div>
          {/* Country */}
          <div className="mb-3">
            <label
              htmlFor="country"
              className="d-block"
              style={{ color: "#EF9B28" }}
            >
              Country
            </label>
            <select
              {...register("country", {
                required: "You Must Choose Your Country",
              })}
              id="country"
              className="border-0 border-1 border-bottom bg-transparent p-1 w-100"
              style={{ outline: 0, color: "#ddd" }}
            >
              <option disabled value="">
                Select Your Country
              </option>
              {countriesList.map((country) => (
                <option
                  key={country.Countryname}
                  value={country.Countryname}
                  style={{ color: "#000" }}
                >
                  {country.Countryname}
                </option>
              ))}
            </select>
            {errors.country && (
              <p className="text-danger" role="alert" style={{ fontSize: 12 }}>
                {errors.country.message}
              </p>
            )}
          </div>
          {/* Password */}
          <div className="position-relative">
            <label
              htmlFor="password"
              className="d-block form-label fw-normal"
             
            >
              Password
            </label>
            <input
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value: validation.CONFIRM_PASSWORD_VALIDATION,
                  message:
                    "Minimum 8 chars, with upper/lowercase, number, and special character",
                },
              })}
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter Your Password"
              className="custom-input border-bottom border-0 border-1 border-bottom bg-transparent p-1 w-100"
              style={{ outline: 0 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="btn btn-sm position-absolute end-0 top-50 translate-middle-y text-white"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <i
                className={`fa-solid ${
                  showPassword ? "fa-eye" : "fa-eye-slash"
                }`}
              ></i>
            </button>
            {errors.password && (
              <p className="text-danger" role="alert" style={{ fontSize: 12 }}>
                {errors.password.message}
              </p>
            )}
          </div>
        </fieldset>

        {/* Right Column */}
        <fieldset className="col-md-6">
          <legend className="visually-hidden">Contact Info</legend>
          {/* Email */}
          <div className="mb-3">
            <label
              htmlFor="email"
              className="d-block"
              style={{ color: "#EF9B28" }}
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
              placeholder="Enter Your Email"
              className=" custom-input border-bottom border-0 border-1 border-bottom bg-transparent p-1 w-100"
              style={{ outline: 0 }}
            />
            {errors.email && (
              <p className="text-danger" role="alert" style={{ fontSize: 12 }}>
                {errors.email.message}
              </p>
            )}
          </div>
          {/* Phone */}
          <div className="mb-3">
            <label
              htmlFor="phone"
              className="d-block"
              style={{ color: "#EF9B28" }}
            >
              Phone
            </label>
            <div className="d-flex gap-1 align-items-center bg-transparent">
              <span className="d-inline-block text-white">{phonePrefix}</span>
              <input
                {...register("phoneNumber", {
                  required: "Phone is required",
                  minLength: {
                    value: 10,
                    message: "At least 10 digits",
                  },
                  pattern: {
                    value: /^\d+$/,
                    message: "Digits only",
                  },
                })}
                id="phone"
                type="text"
                placeholder="Enter Your Phone"
                className=" custom-input border-bottom border-0 border-1 border-bottom bg-transparent p-1 w-100"
                style={{ outline: 0 }}
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-danger" role="alert" style={{ fontSize: 12 }}>
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
          {/* Confirm Password */}
          <div className="position-relative">
            <label
              htmlFor="confirmedpassword"
              className="d-block"
              style={{ color: "#EF9B28" }}
            >
              Confirm Password
            </label>
            <input
              {...register("confirmPassword", {
                required: "Confirmed Password is required",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              id="confirmedpassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Your Password"
              className="custom-input border-bottom border-0 border-1 border-bottom bg-transparent p-1 w-100"
              style={{ outline: 0 }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="btn btn-sm position-absolute end-0 top-50 translate-middle-y text-white"
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              <i
                className={`fa-solid ${
                  showConfirmPassword ? "fa-eye" : "fa-eye-slash"
                }`}
              ></i>
            </button>
            {errors.confirmPassword && (
              <p className="text-danger" role="alert" style={{ fontSize: 12 }}>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </fieldset>

        {errorMessage && (
          <p className="text-center text-white mt-2" role="alert">
            {errorMessage}
          </p>
        )}
        <div className="  mt-4 ">
          <Link
            className=" text-white text-decoration-none fw-bold"
            to="/login"
          >
            Login ?
          </Link>
        </div>
        <SubmitBtn
          isSubmitting={isSubmitting}
          title="Register"
          className="mt-3"
        />
      </form>
    </>
  );
}
