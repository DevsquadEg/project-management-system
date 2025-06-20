import { useEffect, useState } from "react";
import { axiosInstance } from "../../../service/urls.js";
import { USERS_URL } from "../../../service/api.js";
import toast from "react-hot-toast";
import NoDataImg from "../../../assets/NoData-Img.png";
import { imgBaseURL } from "../../../service/api.js";
import moment from "moment";
import { useParams } from "react-router-dom";
import Modal from "react-bootstrap/Modal";

export default function Users() {
  const params = useParams();
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTitle, setSearchTitle] = useState("");
  const [totalNumberOfRecords, setTotalNumberOfRecords] = useState();

  const [userList, setUserList] = useState([]);
  const [viewList, setViewList] = useState<any | null>(null);

  // model bootstrap lists show
  const [showView, setShowView] = useState(false);
  const handleCloseView = () => {
    setShowView(false);
    setViewList(null);
  };
  const handleShowView = async (id: any) => {
    await showUserList(id); // show without button
    setShowView(true);
  };

  // get users list
  const getAllUsers = async (
    userName: any,
    pageSizeValue = pageSize,
    page = pageNumber
  ) => {
    try {
      let response: any = await axiosInstance.get(USERS_URL.GET_ALL_USERS, {
        params: {
          pageSize: pageSizeValue,
          pageNumber: page,
          userName,
        },
      });

      console.log(response.data.data);
      setUserList(response.data.data);
      setTotalPages(response.data.totalNumberOfPages);
      setTotalNumberOfRecords(response.data.totalNumberOfRecords);
    } catch (error) {
      console.log(error);
    }
  };

  // block isActivated / not activate

  const toggleActivated = async (id: number) => {
    try {
      let response = await axiosInstance.put(USERS_URL.TOGGLE_USER(id));
      console.log(response);
      await getAllUsers("");
      toast.success("Statue has been Changed!");
    } catch (error) {
      console.log(error);
      toast.error("Something Wrong!");
    }
  };

  // show modal function
  const showUserList = async (id: any) => {
    try {
      let response: any = await axiosInstance.get(USERS_URL.GET_USER(id));
      console.log(response.data.data);
      setViewList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setPageNumber(1);
  }, [searchTitle, pageSize]);

  useEffect(() => {
    getAllUsers(searchTitle, pageSize, pageNumber);
  }, [searchTitle, pageSize, pageNumber]);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center px-5 py-4 mb-4 bg-white border border-start-0">
        <h2>Users</h2>
      </div>

      <div className="m-5 mt-4 bg-white rounded-4 shadow-sm">
        {/* =========== search =========== */}
        <div className="d-flex justify-content-between align-items-center">
          <div className="input-group m-4 w-25">
            <span className="input-group-text border-end-0 bg-white rounded-start-pill">
              <i className="fa-solid fa-magnifying-glass text-secondary"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 rounded-end-pill"
              placeholder="Search By Title"
              aria-label="Search"
              aria-describedby="basic-addon1"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
            />
          </div>
        </div>

        <>
          {/* ============== table ====================== */}
          <table className="table table-striped table-hover table-bordered align-middle text-center mb-0  ">
            <thead
              className=" table table-success table-custom "
              style={{ background: "rgba(49, 89, 81, 0.90)" }}
            >
              <tr>
                <th style={{ width: "15%" }}>
                  <span>User Name </span>
                  <i className="bi bi-chevron-expand ms-1 "></i>
                </th>
                <th style={{ width: "15%" }}>
                  <span> Status</span>
                  <i className="bi bi-chevron-expand ms-1 "></i>
                </th>
                <th style={{ width: "15%" }}>
                  <span>Image </span>
                  <i className="bi bi-chevron-expand ms-1 "></i>
                </th>
                <th style={{ width: "15%" }}>
                  <span>Phone Number </span>
                  <i className="bi bi-chevron-expand ms-1 "></i>
                </th>
                <th style={{ width: "15%" }}>
                  <span>Email </span>
                  <i className="bi bi-chevron-expand ms-1 "></i>
                </th>
                <th style={{ width: "15%" }}>
                  <span className="text-center">Date created </span>
                  <i className="bi bi-chevron-expand ms-1 "></i>
                </th>
                <th style={{ width: "15%" }}>
                  <span>Actions </span>
                </th>
              </tr>
            </thead>

            <tbody>
              <>
                {userList.length > 0
                  ? userList.map((user: any) => (
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
                              src={NoDataImg}
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
                        <td>
                          {moment(user.creationDate).format("MM-DD-YYYY")}
                        </td>
                        <td>
                          <div className="dropdown">
                            <button
                              className="btn   "
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <i className="bi bi-three-dots-vertical   dotsCustomize"></i>
                            </button>
                            <ul className="dropdown-menu">
                              <tr>
                                {user?.isActivated ? (
                                  <li>
                                    <a
                                      onClick={() => toggleActivated(user.id)}
                                      className="dropdown-item text-danger"
                                    >
                                      <i className="fa-solid fa-ban  text-danger"></i>{" "}
                                      Block
                                    </a>
                                  </li>
                                ) : (
                                  <li>
                                    <a
                                      onClick={() => toggleActivated(user.id)}
                                      className="dropdown-item text-success"
                                    >
                                      <i className="fa-solid fa-ban  text-success"></i>{" "}
                                      Unblock
                                    </a>
                                  </li>
                                )}
                                <li>
                                  <a
                                    onClick={() => handleShowView(user.id)}
                                    className="dropdown-item"
                                  >
                                    <i className="bi bi-eye  text-success"></i>{" "}
                                    View
                                  </a>
                                </li>
                              </tr>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))
                  : ""}
              </>
            </tbody>
          </table>
        </>
        {/* ============== pagination ====================== */}

        <div className="d-flex justify-content-end align-items-center p-3    gap-5">
          <div className="d-flex align-items-center gap-2">
            <span>Showing</span>
            <select
              className="form-select border rounded-pill px-3 py-1"
              style={{ width: "80px" }}
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPageNumber(1);
              }}
            >
              <option disabled hidden value={pageSize}>
                {pageSize}
              </option>
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
            <span>of {totalNumberOfRecords} Results</span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <span>
              Page {pageNumber} of {totalPages}
            </span>
            <div className="d-flex gap-3">
              <button
                className="btn btn-white border-0 p-1"
                disabled={pageNumber === 1}
                onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
              >
                <i className="bi bi-chevron-left fs-5 text-secondary"></i>
              </button>
              <button
                className="btn btn-white border-0 p-1"
                disabled={pageNumber === totalPages}
                onClick={() =>
                  setPageNumber((prev) => Math.min(prev + 1, totalPages))
                }
              >
                <i className="bi bi-chevron-right fs-5 text-secondary"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal show={showView} onHide={handleCloseView}>
        <Modal.Header closeButton>
          <h4 className="viewHead"> User Details </h4>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className=" d-flex justify-content-center  ">
              {viewList?.imagePath === null ? (
                <img
                  className="  w-25 pb-4  rounded-3 "
                  src={NoDataImg}
                  alt="image"
                />
              ) : (
                <img
                  className=" w-50 pb-4 rounded-3 "
                  src={`${imgBaseURL}${viewList?.imagePath}`}
                  alt="image"
                />
              )}
            </div>
            <h5>
              {" "}
              <span className="viewText"> ⭕ User Name : </span>{" "}
              <span className="viewAnswer text-muted">
                {" "}
                {viewList?.userName}{" "}
              </span>
            </h5>
            <h5>
              {" "}
              <span className="viewText"> ⭕ Phone Number :</span>{" "}
              <span className="viewAnswer text-muted">
                {" "}
                {viewList?.phoneNumber}{" "}
              </span>{" "}
            </h5>
            <h5>
              {" "}
              <span className="viewText"> ⭕ country :</span>{" "}
              <span className="viewAnswer text-muted">
                {" "}
                {viewList?.country}{" "}
              </span>{" "}
            </h5>
            <h5>
              {" "}
              <span className="viewText"> ⭕ Email :</span>{" "}
              <span className="viewAnswer text-muted"> {viewList?.email} </span>{" "}
            </h5>
            <h5>
              {" "}
              <span className="viewText"> ⭕ Date Created :</span>{" "}
              <span className="viewText text-muted   ">
                {" "}
                {viewList?.creationDate}{" "}
              </span>{" "}
            </h5>
            <h5>
              {" "}
              <span className="viewText"> ⭕ Modification Date :</span>{" "}
              <span className="viewText text-muted  ">
                {" "}
                {viewList?.modificationDate}{" "}
              </span>{" "}
            </h5>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
