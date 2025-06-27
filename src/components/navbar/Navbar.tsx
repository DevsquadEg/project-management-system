import { useNavigate } from "react-router-dom";
import { useAuth } from "@/store/AuthContext/AuthContext";
import { imgBaseURL } from "@/service/api";
import { useEffect } from "react";
import styles from "./DarkModeToggle.module.css";
import { useMode } from "@/store/ModeContext/ModeContext";
import Swal from "sweetalert2";

import { MdOutlineWbSunny } from "react-icons/md";
import { BsMoonStarsFill } from "react-icons/bs";
import { FiLock, FiLogOut } from "react-icons/fi";
import { HiBell, HiChevronDown } from "react-icons/hi";

export default function Navbar() {
  const navigate = useNavigate();

  const { loginData, fullUserData, logOutUser }: any = useAuth();
  const { darkMode, setDarkMode } = useMode();

  const handleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // =========== LogOut ========
  const logOut = () => {
    logOutUser();
    navigate("/login");
  };

  // ===========================
  useEffect(() => {
    // console.log("Login Data in Navbar:", loginData);
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center py-3 mx-4 ">
        <div
          className="d-flex align-items-center p-2 rounded-3"
          style={{
            backgroundColor: darkMode ? "#ccc" : "#fff",
            boxShadow: darkMode
              ? "0 2px 4px rgba(255, 255, 255, 0.65)"
              : "none",
          }}
        >
          <img src="/navLogo.svg" className="img-fluid " alt="PMS" />
        </div>
        <div className="d-flex align-items-center justify-content-evenly gap-4 px-2">
          {/* <!-- Notification icon --> */}
          <div
            className="position-relative"
            style={{ width: "fit-content", cursor: "pointer" }}
          >
            <HiBell size={28} color="#EF9B28" />
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style={{
                fontSize: "0.6rem",
                padding: "2px 6px",
                fontWeight: "bold",
              }}
            >
              3
            </span>
          </div>

          {/* Dark & light mode toggle icon */}
          <div className={styles.toggleContainer} onClick={handleDarkMode}>
            <div className={styles.toggleContainer} onClick={handleDarkMode}>
              {darkMode ? (
                <MdOutlineWbSunny size={24} color="#EF9B28" />
              ) : (
                <BsMoonStarsFill size={20} color="#EF9B28" />
              )}
            </div>
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
              src={`${imgBaseURL}${
                fullUserData?.imagePath || "files/users/images/806profile.jpeg"
              }`}
              alt="user"
              className="rounded-circle"
              width="40"
              height="40"
            />
            <div className="d-flex flex-column">
              {/* <span>{loginData?.userName}</span> */}
              <small className="">{loginData?.userEmail}</small>
              <span className="text-muted fw-light">
                {loginData?.userGroup}
              </span>
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
              <HiChevronDown
                size={18}
                color={darkMode ? "#f8f9fa" : "#212529"}
              />
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-lg">
              <li>
                <button
                  className={`dropdown-item d-flex align-items-center gap-2  ${
                    darkMode ? `text-whtie` : `text-secondary`
                  }`}
                  onClick={() => {
                    navigate("/change-password");
                  }}
                >
                  <FiLock size={18} color={darkMode ? "#f8f9fa" : "#212529"} />{" "}
                  Change Password
                </button>
              </li>
              <li>
                <button
                  className={`dropdown-item d-flex align-items-center gap-2 ${
                    darkMode ? "text-light" : "text-danger"
                  }`}
                  style={{
                    backgroundColor: darkMode ? "#1c1c1c" : "#fff",
                    borderRadius: "6px",
                  }}
                  onClick={() =>
                    Swal.fire({
                      title: "LogOut!",
                      text: "Do you want to continue?",
                      icon: "warning",
                      confirmButtonText: "Logout",
                      showCloseButton: true,
                      background: darkMode ? "#2c2c2c" : "#fff",
                      color: darkMode ? "#fff" : "#000",
                    }).then((result: any) => {
                      if (result.isConfirmed) {
                        logOut();
                      }
                    })
                  }
                >
                  <FiLogOut
                    size={18}
                    color={darkMode ? "#ffffff" : "#dc3545"}
                  />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
