import { useEffect, useState } from "react";
import { axiosInstance } from "../../../service/urls.js";
import { USERS_URL } from "../../../service/api.js";
import toast from "react-hot-toast";
import { imgBaseURL } from "../../../service/api.js";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { useMode } from "@/store/ModeContext/ModeContext.js";
import { useAuth } from "@/store/AuthContext/AuthContext.js";
import { Helmet } from "react-helmet-async";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import type { UserType } from "@/interfaces/interfaces.js";
import { isAxiosError } from "axios";
import Search from "@/components/shared/Search.js";
import Pagination from "@/components/shared/Pagination.js";

export default function Users() {
  //======= hooks ==============
  const { loginData } = useAuth();
  const navigate = useNavigate();
  const { darkMode } = useMode();

  //======= loading  ==============
  const [loading, setLoading] = useState(true);

  //======= paginate ==============
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTitle, setSearchTitle] = useState("");
  const [totalNumberOfRecords, setTotalNumberOfRecords] = useState(0);

  const [userList, setUserList] = useState<UserType[]>([]);
  const [viewList, setViewList] = useState<UserType | null>(null);

  // model bootstrap lists show
  const [showView, setShowView] = useState(false);
  const handleCloseView = () => {
    setShowView(false);
    setViewList(null);
  };
  const handleShowView = async (id: number) => {
    await showUserList(id); // show without button
    setShowView(true);
  };

  // get users list
  const getAllUsers = async (
    userName: string,
    pageSizeValue = pageSize,
    page = pageNumber
  ) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(USERS_URL.GET_ALL_USERS, {
        params: {
          pageSize: pageSizeValue,
          pageNumber: page,
          ...(userName && { userName }),
        },
      });

      // console.log(response.data.data);
      // console.log(response.data.data);
      setUserList(response.data.data);
      setTotalPages(response.data.totalNumberOfPages);
      setTotalNumberOfRecords(response.data.totalNumberOfRecords);
    } catch (error) {
      // console.log(error);
      if (isAxiosError(error)) {
        toast.error(error?.response?.data.message || "Something went wrong!");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  // block isActivated / not activate

  const toggleActivated = async (id: number) => {
    try {
      await axiosInstance.put(USERS_URL.TOGGLE_USER(id));
      // console.log(response);
      await getAllUsers("");
      toast.success("Statue has been Changed!");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message || "Something Wrong!");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  // show modal function
  const showUserList = async (id: number) => {
    try {
      const response = await axiosInstance.get(USERS_URL.GET_USER(id));
      // console.log(response.data);
      setViewList(response.data);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message || "Something Wrong!");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  useEffect(() => {
    if (loginData?.userGroup != "Manager") {
      navigate("/dashboard");
    }
    setPageNumber(1);
  }, [searchTitle, pageSize]);

  useEffect(() => {
    getAllUsers(searchTitle, pageSize, pageNumber);
  }, [searchTitle, pageSize, pageNumber]);

  return (
    <>
      <Helmet>
        <title>Users | Project Management System</title>
        <meta
          name="description"
          content="Manage users within your project management system. View user details, edit accounts, or remove inactive users."
        />
        <meta
          name="keywords"
          content="Users, Project Management, Admin Panel, Team Members, User Accounts"
        />
      </Helmet>

      <div
        className={`d-flex justify-content-between align-items-center px-5 py-4 mb-4 ${
          darkMode ? "bg-dark" : "bg-white"
        } border border-start-0`}
      >
        <h2>Users</h2>
      </div>

      <div
        className={`m-5 mt-4 ${
          darkMode ? "bg-dark" : "bg-white"
        } rounded-4 shadow-sm`}
      >
        {/* =========== search =========== */}
        <Search
          darkMode={darkMode}
          searchTitle={searchTitle}
          setSearchTitle={setSearchTitle}
        />

        <>
          {/* ============== table ====================== */}
          <table className="table table-striped table-hover table-bordered align-middle text-center mb-0  ">
            <thead className=" table table-success table-custom tableEnhance ">
              <tr>
                <th className="thEnhance">
                  <span>User Name </span>
                  <i className="bi bi-chevron-expand ms-1 "></i>
                </th>
                <th className="thEnhance">
                  <span> Status</span>
                  <i className="bi bi-chevron-expand ms-1 "></i>
                </th>
                <th className="thEnhance">
                  <span>Image </span>
                  <i className="bi bi-chevron-expand ms-1 "></i>
                </th>
                <th className="thEnhance">
                  <span>Phone Number </span>
                  <i className="bi bi-chevron-expand ms-1 "></i>
                </th>
                <th className="thEnhance">
                  <span>Email </span>
                  <i className="bi bi-chevron-expand ms-1 "></i>
                </th>
                <th className="thEnhance">
                  <span className="text-center">Date created </span>
                  <i className="bi bi-chevron-expand ms-1 "></i>
                </th>
                <th className="thEnhance">
                  <span>Actions </span>
                </th>
              </tr>
            </thead>

            <tbody>
              <>
                {userList.map((user: UserType) => (
                  <tr key={user?.id}>
                    <td>{user.userName}</td>
                    <td>
                      {user?.isActivated ? (
                        <span className="badge bg-success p-2 rounded-5 activeCustomize">
                          Active
                        </span>
                      ) : (
                        <span className="badge bg-danger rounded-5 p-2 notActiveCustomize">
                          Not Active
                        </span>
                      )}
                    </td>
                    <td data-cell="Image ">
                      {user?.imagePath === null ? (
                        <img
                          className="img-table"
                          src={`/profile.jpeg`}
                          alt="image"
                        />
                      ) : (
                        <img
                          className="img-table"
                          src={`${imgBaseURL}${user?.imagePath}`}
                          alt="image"
                        />
                      )}
                    </td>
                    <td>{user.phoneNumber}</td>
                    <td>{user.email}</td>
                    <td>{moment(user.creationDate).format("MM-DD-YYYY")}</td>
                    <td>
                      <div className="dropdown">
                        <button
                          className="btn border-0"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <HiOutlineDotsHorizontal size={20} />
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                          <li>
                            <button
                              className={`dropdown-item d-flex align-items-center gap-2 ${
                                user?.isActivated
                                  ? "text-danger"
                                  : "text-success"
                              }`}
                              onClick={() => toggleActivated(user.id)}
                            >
                              <i className="fa-solid fa-ban"></i>{" "}
                              {user?.isActivated ? "Block" : "Unblock"}
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item d-flex align-items-center gap-2 "
                              onClick={() => handleShowView(user.id)}
                            >
                              <i className="bi bi-eye"></i> View
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
                {loading && userList.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-4">
                      <div className="my-5">
                        <i className="fa fa-spinner fa-spin fa-5x"></i>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            </tbody>
          </table>
        </>
        {userList.length === 0 && !loading && (
          <h5 className="text-muted text-center p-3 fs-2">
            Found no Users{searchTitle ? ` with Title "${searchTitle}"` : ""}
          </h5>
        )}
        {/* ============== pagination ====================== */}

        <Pagination
          pageNumber={pageNumber}
          pageSize={pageSize}
          setPageNumber={setPageNumber}
          setPageSize={setPageSize}
          totalNumberOfRecords={totalNumberOfRecords}
          totalPages={totalPages}
        />
      </div>

      <Modal show={showView} onHide={handleCloseView} centered>
        <Modal.Header closeButton>
          <h4 className="viewHead"> User Details </h4>
        </Modal.Header>
        <Modal.Body>
          <div className="container ">
            <div className="row justify-content-center">
              <div className="">
                <div className="card  border-0 rounded-4">
                  <div className="card-body text-center">
                    <div className="mb-4">
                      {viewList?.imagePath === null ? (
                        <img
                          className="  rounded-circle shadow imgEnhanceUser "
                          src={`/profile.jpeg`}
                          alt="image"
                          width="130"
                          height="130"
                        />
                      ) : (
                        <img
                          className="rounded-circle shadow imgEnhanceUser"
                          src={`${imgBaseURL}${viewList?.imagePath}`}
                          alt="image"
                          width="130"
                          height="130"
                        />
                      )}
                    </div>
                    <h4 className="fw-bold text-primary mb-1">
                      {viewList?.userName}
                    </h4>
                    <p className="text-muted mb-3">{viewList?.email}</p>

                    <ul className="list-group text-start mb-4">
                      <li className="list-group-item d-flex justify-content-between">
                        <strong>Country</strong>{" "}
                        <span>{viewList?.country}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <strong>Phone</strong>{" "}
                        <span>{viewList?.phoneNumber || "N/A"}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <strong>Role</strong>{" "}
                        <span>{viewList?.group?.name}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <strong>Status</strong>{" "}
                        <span
                          className={`badge ${
                            viewList?.isActivated ? "bg-success" : "bg-danger"
                          }`}
                        >
                          {viewList?.isActivated ? "Activated" : "Inactive"}
                        </span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <strong>Joined At</strong>{" "}
                        <span>
                          {viewList &&
                            new Date(
                              viewList.creationDate
                            ).toLocaleDateString()}
                        </span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <strong>Last Modified</strong>{" "}
                        <span>
                          {viewList &&
                            new Date(
                              viewList.modificationDate
                            ).toLocaleDateString()}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
