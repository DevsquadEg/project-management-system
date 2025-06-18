import { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";

export default function SideBar() {
  const location = useLocation();
  const [isCollapse, setIsCollapse] = useState(false);
  return (
    <>
      <div className="sidebar-container">
        <div
          onClick={() => setIsCollapse(!isCollapse)}
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
              icon={<i className="fa-solid fa-house"></i>}
              component={<Link to="/dashboard" />}
            >
              Home
            </MenuItem>

            <MenuItem
              className={location.pathname === "/users" ? "active-menu" : ""}
              icon={<i className="fa-solid fa-users"></i>}
              component={<Link to="/users" />}
            >
              Users
            </MenuItem>

            <MenuItem
              className={location.pathname === "/projects" ? "active-menu" : ""}
              icon={<i className="fa-solid fa-diagram-project"></i>}
              component={<Link to="/projects" />}
            >
              Projects
            </MenuItem>

            <MenuItem
              className={location.pathname === "/tasks" ? "active-menu" : ""}
              icon={<i className="fa-solid fa-list-check"></i>}
              component={<Link to="/tasks" />}
            >
              All Tasks
            </MenuItem>

            <MenuItem
              className={
                location.pathname === "/my-projects" ? "active-menu" : ""
              }
              icon={<i className="fa-solid fa-briefcase"></i>}
              component={<Link to="/my-projects" />}
            >
              My Projects
            </MenuItem>

            <MenuItem
              className={location.pathname === "/my-tasks" ? "active-menu" : ""}
              icon={<i className="fa-solid fa-check-double"></i>}
              component={<Link to="/my-tasks" />}
            >
              My Tasks
            </MenuItem>
          </Menu>
        </Sidebar>
      </div>
    </>
  );
}
