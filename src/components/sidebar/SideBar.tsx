import { useAuth } from "@/store/AuthContext/AuthContext";
import { useEffect, useState } from "react";
import { FaProjectDiagram } from "react-icons/fa";
import {
  MdChecklist,
  MdOutlineWork,
  MdPeople,
  MdSpaceDashboard,
  MdTaskAlt,
} from "react-icons/md";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";

export default function SideBar() {
  const location = useLocation();
  const [isCollapse, setIsCollapse] = useState(false);
  const { loginData }: any = useAuth();

  const handleCollapse = () => {
    setIsCollapse(!isCollapse);
    localStorage.setItem("isCollapse", String(!isCollapse));
  };

  useEffect(() => {
    const storedIsCollapse = localStorage.getItem("isCollapse");
    if (storedIsCollapse !== null) {
      setIsCollapse(JSON.parse(storedIsCollapse));
    }
  }, []);

  return (
    <>
      <div className="sidebar-container">
        <div
          onClick={() => handleCollapse()}
          className="toggle-arrow"
          style={{
            position: "absolute",
            top: "30px",
            right: isCollapse ? "-13px" : "-13px",
            background: "#EF9B28",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            boxShadow: "0 0 5px rgba(0,0,0,0.2)",
            zIndex: 1000,
          }}
        >
          <i
            className={`fa-solid ${
              isCollapse ? "fa-angle-right" : "fa-angle-left"
            }`}
          ></i>
        </div>

        <Sidebar
          collapsed={isCollapse}
          // onMouseEnter={() => setIsCollapse(false)}
          // onMouseLeave={() => setIsCollapse(true)}
        >
          <Menu className="pt-5">
            <MenuItem
              className={
                location.pathname === "/dashboard" ? "active-menu" : ""
              }
              icon={<MdSpaceDashboard size={20} />}
              component={<Link to="/dashboard" />}
            >
              Home
            </MenuItem>

            {loginData?.userGroup == "Manager" && (
              <MenuItem
                className={location.pathname === "/users" ? "active-menu" : ""}
                icon={<MdPeople size={20} />}
                component={<Link to="/users" />}
              >
                Users
              </MenuItem>
            )}

            {loginData?.userGroup == "Manager" && (
              <MenuItem
                className={
                  location.pathname === "/projects-system" ? "active-menu" : ""
                }
                icon={<FaProjectDiagram size={18} />}
                component={<Link to="/projects-system" />}
              >
                Projects System
              </MenuItem>
            )}
            <MenuItem
              className={
                location.pathname === "/projects-manage" ? "active-menu" : ""
              }
              icon={<MdOutlineWork size={20} />}
              component={<Link to="/projects-manage" />}
            >
              My Projects
            </MenuItem>
            {loginData?.userGroup == "Manager" && (
              <MenuItem
                className={location.pathname === "/tasks" ? "active-menu" : ""}
                icon={<MdChecklist size={20} />}
                component={<Link to="/tasks" />}
              >
                All Tasks
              </MenuItem>
            )}

            {loginData?.userGroup != "Manager" && (
              <MenuItem
                className={
                  location.pathname === "/my-tasks" ? "active-menu" : ""
                }
                icon={<MdTaskAlt size={20} />}
                component={<Link to="/my-tasks" />}
              >
                My Tasks
              </MenuItem>
            )}
          </Menu>
        </Sidebar>
      </div>
    </>
  );
}
