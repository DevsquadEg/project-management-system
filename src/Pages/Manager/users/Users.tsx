import { useEffect, useState } from "react";
import { axiosInstance } from "../../../service/urls.js";
import { USERS_URL } from "../../../service/api.js";
import toast from "react-hot-toast";
import NoDataImg from "../../../assets/NoData-Img.png";
import { imgBaseURL } from "../../../service/api.js";
import moment from "moment";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function Users() {
  const params = useParams();
  const [nameValue, setNameValue] = useState(""); //search
  const [userList, setUserList] = useState([]);
  const [userId, setUserId] = useState(null);
  const [viewList, setViewList] = useState([]);

  // model bootstrap lists show
  const [showView, setShowView] = useState(false);
  const handleCloseView = () => setShowView(false);
  const handleShowView = (id: any) => {
    setUserId(id);
    setShowView(true);
  };

  // get users list
  const getAllUsers = async (userName: any) => {
    try {
      let response: any = await axiosInstance.get(USERS_URL.GET_ALL_USERS, {
        params: {
          pageSize: 10,
          pageNumber: 1,
          userName,
        },
      });

      console.log(response.data.data);
      setUserList(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // search function
  const getNameValue = (input: any) => {
    setNameValue(input.target.value);
    getAllUsers(input.target.value);
  };

  // block isActivated / not activate

  const toggleActivated = async (id: number) => {
    try {
      let response = await axiosInstance.put(USERS_URL.TOGGLE_USER(id));
      console.log(response);
      await getAllUsers("");
      toast.success(" Statue has been Changed!");
    } catch (error) {
      console.log(error);
      toast.error("Something Wrong!");
    }
  };

  // show modal function
  const showUserList = async () => {
    try {
      let response: any = await axiosInstance.get(USERS_URL.GET_USER(userId));
      console.log(response.data.data);
      setViewList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUsers("");
  }, []);

  return (
    <>
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
                  src={`${imgBaseURL}${viewList.imagePath}`}
                  alt="image"
                />
              )}
            </div>
            <h5>
              {" "}
              <span className="viewText"> ⭕ User Name : </span>{" "}
              <span className="viewAnswer text-muted">
                {" "}
                {viewList.userName}{" "}
              </span>
            </h5>
            <h5>
              {" "}
              <span className="viewText"> ⭕ Phone Number :</span>{" "}
              <span className="viewAnswer text-muted">
                {" "}
                {viewList.phoneNumber}{" "}
              </span>{" "}
            </h5>
            <h5>
              {" "}
              <span className="viewText"> ⭕ country :</span>{" "}
              <span className="viewAnswer text-muted">
                {" "}
                {viewList.country}{" "}
              </span>{" "}
            </h5>
            <h5>
              {" "}
              <span className="viewText"> ⭕ Email :</span>{" "}
              <span className="viewAnswer text-muted"> {viewList.email} </span>{" "}
            </h5>
            <h5>
              {" "}
              <span className="viewText"> ⭕ Date Created :</span>{" "}
              <span className="viewText text-muted   ">
                {" "}
                {viewList.creationDate}{" "}
              </span>{" "}
            </h5>
            <h5>
              {" "}
              <span className="viewText"> ⭕ Modification Date :</span>{" "}
              <span className="viewText text-muted  ">
                {" "}
                {viewList.modificationDate}{" "}
              </span>{" "}
            </h5>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="btn btn-outline-success" onClick={showUserList}>
            View Category
          </Button>
        </Modal.Footer>
      </Modal>

      <div className=" bg-white   py-3">
        <h3 className=" ms-3  text-muted  ">Users</h3>
      </div>

      <div className="container-fluid mt-4 shadow-lg bg-light rounded-3">
        {/* Search & Filter */}
        <div className="d-flex gap-2">
          {/* Search Input with Icon  */}

          <div className="d-flex      justify-content-between  mb-3 input-group   ">
            <div className="input-group w-25 pb-2 pt-4  ">
              <span className="input-group-text bg-white border-0  ">
                <i className="fas fa-search text-muted iconCustomize"></i>
              </span>
              <input
                type="text"
                className="form-control  border-0 "
                placeholder="  Search Fleets"
                aria-label="Username"
                aria-describedby="visible-addon"
                onChange={getNameValue}
                style={{
                  borderTopRightRadius: "2rem",
                  borderBottomRightRadius: "2rem",
                  borderLeft: "none", // Explicitly remove left border
                  borderColor: "#ced4da", // Match Bootstrap's default input border color
                }}
              />
              {/* Filter Button  */}

              <div>
                <button
                  className="btn btn-outline-secondary rounded-5   ms-2 d-flex align-items-center   gap-2 "
                  disabled
                >
                  <i className="fas fa-filter"></i>
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {/* {loading && <Spinner animation="border" />} */}

        {/* Error Message */}
        {/* {error && <Alert variant="danger">{error}</Alert>} */}

        {/* Users Table */}
        {/* {!loading && !error && ( */}
        <>
          <table className=" table table-striped text-center custom-table ">
            <thead className=" table-dark ">
              <tr>
                <th>User Name</th>
                <th>Status</th>
                <th>Images</th>
                <th>Phone Number</th>
                <th>Email</th>
                <th>Date Created</th>
                <th>Actions</th>
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

          <tfoot></tfoot>
        </>
        {/* )} */}
      </div>
    </>
  );
}
