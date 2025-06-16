import { Outlet } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import SideBar from "../../components/sidebar/SideBar";

export default function MasterLayout() {
  return (
    <>
      <div className="w-100">
        <div className="container-fluid py-2 px-0 " style={{
          background: "#FFF",
          boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.15)"
        }}>
          <Navbar />
        </div>
      </div>
      <div className=" d-flex ">
        <div className=" position-sticky top-0 vh-100 bg-info">
          <SideBar />
        </div>
        <div className="w-100 p-4 ">
          <div className="  ">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
