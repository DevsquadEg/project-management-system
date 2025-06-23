import { useNavigate } from "react-router-dom";
import { useAuth } from "@/store/AuthContext/AuthContext";
import { imgBaseURL } from "@/service/api";
import { useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const { loginData, fullUserData, logOutUser }: any = useAuth();

  // =========== LogOut ========
  const logOut = () => {
    logOutUser();
    navigate("/login");
  };
  // ===========================
  useEffect(() => {
    console.log("Login Data in Navbar:", loginData);
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center py-3 mx-4 ">
        <div>
          <img src="/navLogo.svg" className="img-fluid " alt="PMS" />
        </div>
        <div className="d-flex align-items-center justify-content-evenly gap-4 px-2">
          {/* <!-- Notification icon --> */}
          <div className="position-relative">
            <i
              style={{ color: "#EF9B28" }}
              className="fa-solid fa-bell fs-4 text-warning"
            ></i>
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style={{
                fontSize: "0.6rem",
              }}
            >
              1
            </span>
          </div>
          {/* <!-- Divider --> */}
          <div
            className="border-start mx-2"
            style={{
              height: "40px",
              width: "2px",
              marginTop: "5px",
              backgroundColor: "#eee",
              opacity: "1",
            }}
          ></div>
          {/* <!-- User avatar --> */}
          <div
            className="d-flex gap-3 align-items-center "
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/profile")}
          >
            <img
              //   src="https://randomuser.me/api/portraits/men/75.jpg"
              src={`${imgBaseURL}${
                fullUserData?.imagePath || "files/users/images/806profile.jpeg"
              }`}
              alt="user"
              className="rounded-circle"
              width="40"
              height="40"
            />
            <div className="d-flex flex-column">
              <span>{loginData?.userName}</span>
              <small className="text-muted">{loginData?.userEmail}</small>
            </div>
          </div>

          {/* <!-- Arrow --> */}
          <div className="dropdown ">
            <button
              className="btn border-0"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fa-solid fa-angle-down"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-lg">
              <li>
                <button
                  className="dropdown-item d-flex align-items-center gap-2 text-secondary"
                  onClick={() => {
                    navigate("/change-password");
                  }}
                >
                  <i className="bi bi-key "></i> Change Password
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item d-flex align-items-center gap-2 text-danger"
                  onClick={logOut}
                >
                  <i className="fa-solid fa-right-from-bracket "></i> Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
