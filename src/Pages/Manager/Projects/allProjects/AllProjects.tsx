import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PROJECT_URLS } from "@/service/api";
import { axiosInstance } from "@/service/urls";
import { isAxiosError } from "axios";
import DeleteModal from "@/components/DeleteModal/DeleteModal";
import { useNavigate } from "react-router-dom";
import { useMode } from "@/store/ModeContext/ModeContext";
import { useAuth } from "@/store/AuthContext/AuthContext";
import { Helmet } from "react-helmet-async";

export default function AllProjects() {
  //=======  hooks ==============
  const navigate = useNavigate();
  const { darkMode } = useMode();
  const { loginData }: any = useAuth();
  //=======  states ==============
  const [allProjects, setAllProjects] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [pageSize, setPageSize] = useState(3);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalNumberOfRecords, setTotalNumberOfRecords] = useState();

  //=======  role base manager/employee ==============
  const isManager = loginData?.userGroup === "Manager";
  const url = isManager
    ? PROJECT_URLS.GET_PROJECTS_BY_MANAGER
    : PROJECT_URLS.GET_PROJECTS_BY_EMPLOYEE;

  //=======  get all projects ==============

  const getAllProjects = useCallback(
    async (title = "", pageSizeValue = pageSize, page = pageNumber) => {
      try {
        const response = await axiosInstance.get(url, {
          params: {
            ...(title && { title }),
            pageSize: pageSizeValue,
            pageNumber: page,
          },
        });

        console.log(response.data.totalNumberOfRecords);
        setAllProjects(response.data.data);
        setTotalPages(response.data.totalNumberOfPages);
        setTotalNumberOfRecords(response.data.totalNumberOfRecords);
      } catch (error) {
        if (isAxiosError(error)) {
          toast.error(error?.response?.data.message || "Something went wrong!");
        }
      }
    },
    []
  );
  // --------------- delete project -------------
  const onDeleteProject = async (id: number, onSuccess: any) => {
    try {
      setIsSubmitting(true);
      await axiosInstance.delete(PROJECT_URLS.DELETE_PROJECT(id));
      toast.success("Project Deleted Successfully");
      onSuccess();
      getAllProjects();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  //=======  useEffect ==============
  useEffect(() => {
    if (loginData?.userGroup != "Manager") {
      navigate("/dashboard");
      return;
    }
    const delayDebounce = setTimeout(() => {
      setPageNumber(1); // Reset pagination
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTitle, pageSize]);

  useEffect(() => {
    if (loginData?.userGroup != "Manager") {
      navigate("/dashboard");
      return;
    }
    getAllProjects(searchTitle, pageSize, pageNumber);
    // console.log(totalNumberOfRecords);
  }, [pageNumber, searchTitle, pageSize]);

  return (
    <>
      <Helmet>
        <title>Projects | Project Management System</title>
        <meta
          name="description"
          content="Manage Projects within your project management system. View user details, edit accounts, or remove Projects."
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
        <h2>My Projects</h2>
        <div>
          {loginData?.userGroup != "Employee" ? (
            <button
              onClick={() => navigate("/projects/add")}
              className="btn btn-lg bg-orange rounded-pill text-white px-5"
            >
              add new project
            </button>
          ) : (
            ""
          )}
        </div>
      </div>

      <div
        className={`m-5 mt-4 ${
          darkMode ? "bg-dark" : "bg-white"
        } rounded-4 shadow-sm`}
      >
        {/* =========== search =========== */}
        <div className="d-flex justify-content-between align-items-center">
          <div className="input-group m-4 w-25">
            <span
              className={`input-group-text border-end-0 ${
                darkMode ? "bg-dark" : "bg-white"
              } rounded-start-pill`}
            >
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

        {/* ============== table ====================== */}
        <table className="table table-striped table-hover table-bordered align-middle text-center mb-0 ">
          <thead
            className="table table-success table-custom"
            style={{ background: "rgba(49, 89, 81, 0.90)" }}
          >
            <tr>
              <th style={{ width: "25%" }}>
                <span>Title</span>
                <i className="bi bi-chevron-expand ms-1 "></i>
              </th>
              <th style={{ width: "40%" }}>
                <span>Description</span>
                <i className="bi bi-chevron-expand ms-1 "></i>
              </th>

              <th style={{ width: "15%" }}>
                <span>Num Tasks</span>
                <i className="bi bi-chevron-expand ms-1 "></i>
              </th>
              <th style={{ width: "20%" }}>
                <span>Date Created</span>
                <i className="bi bi-chevron-expand ms-1 "></i>
              </th>
              {loginData?.userGroup != "Employee" && (
                <th style={{ width: "25%" }}>
                  <span>Actions</span>
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {allProjects.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-muted py-4">
                  <div className="my-5">
                    <i className="fa fa-spinner fa-spin fa-5x"></i>
                  </div>
                </td>
              </tr>
            ) : (
              allProjects.map((project: any) => (
                <tr key={project.id}>
                  <td>{project.title}</td>
                  <td>{project.description}</td>
                  <td>{project.task.length}</td>
                  <td>{new Date(project.creationDate).toLocaleDateString()}</td>
                  {loginData?.userGroup != "Employee" && (
                    <td>
                      <div className="dropdown">
                        <button
                          className="btn  border-0"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <i className="fa-solid fa-ellipsis fa-lg"></i>
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end shadow  border-0">
                          <li>
                            <button
                              className="dropdown-item d-flex align-items-center gap-2 text-success"
                              onClick={() =>
                                navigate(`/projects/edit/${project.id}`)
                              }
                            >
                              <i className="bi bi-pencil-square"></i> Edit
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => {
                                setSelectedProject(project.id);
                                // setModalType("delete");
                                setShowDeleteModal(true);
                              }}
                              className="dropdown-item d-flex align-items-center gap-2 text-danger"
                            >
                              <i className="bi bi-trash"></i> Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* ============== pagination ====================== */}
        <div className="d-flex justify-content-end align-items-center p-3    gap-5">
          <div className="d-flex align-items-center gap-2">
            <span>Showing</span>
            <select
              className="form-select border rounded-pill px-3 py-1"
              style={{ width: "80px" }}
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              <option disabled hidden value={pageSize}>
                {pageSize}
              </option>
              <option value="2">2</option>
              <option value="4">4</option>
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
      {/* Modal delete Logic */}
      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() =>
          onDeleteProject(selectedProject, () => setShowDeleteModal(false))
        }
        itemName={
          allProjects.find((project: any) => project.id === selectedProject)
            ?.title
        }
        title="Delete Project"
        isSubmitting={isSubmitting}
      />
    </>
  );
}
