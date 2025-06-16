import {USERS_URL} from "../../../service/api.js";
import { axiosInstance } from "../../../service/urls.js";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";


export default function ChangePassword() {

    const [isFirstPassVisible, setIsFirstPassVisible] = useState(false); // eye flash old password
    const [isSecondPassVisible, setIsSecondPassVisible] = useState(false); // eye flash new and confirm password
    const navigate = useNavigate();
  
  
    const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,watch,trigger} = useForm({mode:"onChange"}); // (mode) to make it real time match error (trigger) to trag between password and confirm password

   


    // =========== Change Password ========
    const onChangePass = async(data:any)=>{
    try { 
    let response = await axiosInstance.put(USERS_URL.CHANGE_PASSWORD, data);
    console.log(response);
    navigate('/dashboard');
    toast.success( response?.data?.message ||"Password has been updated successfully!");
       
    } catch (error) {
    console.log(error);
    toast.error( error?.response?.data?.message || "Invalid Password");
      
    }}

      









  
    useEffect(() => {
    if (watch("confirmPassword")) {
    trigger("confirmPassword");
    }
    }, [watch("password"), watch("confirmPassword"), trigger]);




  return (
   <>
      <div className="auth-container w-100 vh-100 bg-info">
        <div className="container-fluid">
          <div className="w-100 py-5 d-flex justify-content-center">
            <img className="" src="/pmsLogo.svg" alt="pmslogo" />
          </div>
          <div className="row justify-content-center align-items-center">
            <div className="col-md-10 col-lg-6 px-sm-4 px-md-5 py-4 auth-area rounded">
              <form onSubmit={handleSubmit(onChangePass)} className="text-start">
                <div className="text-start mb-4">
                  <small className="text-white">welcome to PMS</small>
                  <div className="hello">
                  <h2 className="text-warning fw-bold m-0">Change Password</h2>
                  </div>
                </div>


                {/* UI Old Password*/}
                <div className="mb-3">
                {/* label  */}
                <label
                htmlFor="Passeword"
                className="form-label text-warning fw-normal">
                Old Password
                </label>
                <div className="border-bottom d-flex align-items-center pb-1">
                <div className="input-group">
                {/* input */}
                <input
                type={isFirstPassVisible ? "text" : "password"}
                placeholder="Enter your Old Password"
                className="form-control   "
                {...register("oldPassword",{required:"Old Password is Required",    // validtion for old password
                pattern:{
                value:/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/,
                message:' must include at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 6 characters long.'
                }})}/>
                {/* show password icon  */}
                <button  type='button' onClick={()=>setIsFirstPassVisible((prev)=>!prev)}  
                onMouseDown={(e)=> e.preventDefault()} onMouseUp={(e)=> e.preventDefault} // to prevent the feature of unfocus when i click on the icon 
                className="input-group-text btnSlash" id="addon-wrapping">
                <i className= {`fa-regular ${isFirstPassVisible ? "fa-eye " : "fa-eye-slash"}`}></i></button>
                </div>
                </div>
                {errors.oldPassword&&<span className='text-danger ps-1'>{errors.oldPassword.message }</span>}  
                </div>




                {/*  UI New Password  */}
                <div className="mb-3">
                {/* label  */}
                <label
                htmlFor="password"
                className="form-label text-warning fw-normal">
                New Password
                </label>
                <div className="border-bottom d-flex align-items-center pb-1">
                <div className="input-group">
                {/* input */}
                <input
                type={isSecondPassVisible ? "text" : "password"}
                placeholder="Enter Your New Password"
                {...register("newPassword",{required:"New Password is Required", // validtion for New password
                })}
                className="form-control  "
                style={{ backgroundColor: "black", color: "white" }}/>
                {/* show password icon  */}
                <button type='button' onClick={()=>setIsSecondPassVisible((prev)=>!prev)}  
                onMouseDown={(e)=> e.preventDefault()} onMouseUp={(e)=> e.preventDefault} // to prevent the feature of unfocus when i click on the icon 
                className="input-group-text btnSlash" id="addon-wrapping">
                <i className= {`fa-regular ${isSecondPassVisible ? "fa-eye " : "fa-eye-slash"}`}></i></button>
                </div></div>
                {errors.newPassword&&<span className='text-danger ps-1'>{errors.newPassword.message }</span>} 
                </div>



                {/* UI Confirm Password  */}
                <div className="mb-3">
                {/* label  */}
                <label
                htmlFor="password"
                className="form-label text-warning fw-normal">
                Confirm New Password
                </label>
                <div className="border-bottom d-flex align-items-center pb-1">
                <div className="input-group ">
                {/* input */}
                <input
                type={isSecondPassVisible ? "text" : "password"}
                placeholder="Enter Your New Password"
                {...register("confirmNewPassword",                      // validtion for confirm password
                {required:"Confirm New Password is Required",
                validate: (value) =>
                value === watch("newPassword") || "Passwords do not match",//match passowrd and confirm password
                })}
                className="form-control  "
                style={{ backgroundColor: "black", color: "white" }}/>
                {/* show password icon  */}
                <button type='button' onClick={()=>setIsSecondPassVisible((prev)=>!prev)}  
                onMouseDown={(e)=> e.preventDefault()} onMouseUp={(e)=> e.preventDefault} // to prevent the feature of unfocus when i click on the icon 
                className="input-group-text btnSlash" id="addon-wrapping">
                <i className= {`fa-regular ${isSecondPassVisible ? "fa-eye " : "fa-eye-slash"}`}></i></button>
                </div></div>
                {errors.confirmNewPassword&&<span className='text-danger ps-1 '>{errors.confirmNewPassword.message }</span>} 
                </div>



                {/* Submit */}
                <div className="d-grid ">
                  <button
                    type="submit"
                    className="btn  btnAuth  "
                    disabled={isSubmitting}
                   
                  >
                    {isSubmitting  ? "Submittting ..." : "Update Password" } 
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
