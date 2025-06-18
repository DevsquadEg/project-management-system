import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <>
            <div className="auth-container d-flex justify-content-center align-items-center w-100 vh-100 overflow-y-auto">
                <div className="container-fluid d-flex flex-column justify-content-center align-items-center ">
                    <div className="w-100 py-5 d-flex justify-content-center">
                        <img className="" src="/pmsLogo.svg" alt="pmslogo" />
                    </div>
                    <div className="justify-content-center align-items-center">
                        <div className="px-sm-4 px-md-5 p-5 auth-area rounded-4 mb-3">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
