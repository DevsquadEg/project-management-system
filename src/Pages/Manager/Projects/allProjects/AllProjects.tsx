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
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import Pagination from "@/components/shared/Pagination";
import type { AuthContextType, ProjectType } from "@/interfaces/interfaces";
import Search from "@/components/shared/Search";

export default function AllProjects() {
  //=======  hooks ==============
  const navigate = useNavigate();
  const { darkMode } = useMode();
  const { loginData }: AuthContextType = useAuth();
  //=======  states ==============
  const [allProjects, setAllProjects] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [pageSize, setPageSize] = useState(3);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectType>();
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
      setLoading(true);
      try {
        const response = await axiosInstance.get(url, {
          params: {
            ...(title && { title }),
            pageSize: pageSizeValue,
            pageNumber: page,
          },
        });

        // console.log(response.data.totalNumberOfRecords);
        setAllProjects(response.data.data);
        setTotalPages(response.data.totalNumberOfPages);
        setTotalNumberOfRecords(response.data.totalNumberOfRecords);
      } catch (error) {
        if (isAxiosError(error)) {
          toast.error(error?.response?.data.message || "Something went wrong!");
        }
      } finally {
        setLoading(false);
      }
    },
    [pageNumber, pageSize, url]
  );
  // --------------- delete project -------------
  const onDeleteProject = async (id: number, onSuccess: () => void) => {
    try {
      setIsSubmitting(true);
      await axiosInstance.delete(PROJECT_URLS.DELETE_PROJECT(id));

      toast.success("Project Deleted Successfully");
      onSuccess();
      getAllProjects();
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to delete project."
        );
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  //=======  useEffect ==============
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPageNumber(1); // Reset pagination
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTitle, pageSize]);

  useEffect(() => {
    getAllProjects(searchTitle, pageSize, pageNumber);
    // console.log(totalNumberOfRecords);
  }, [pageNumber, searchTitle, pageSize, getAllProjects]);

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

        <Search
          darkMode={darkMode}
          searchTitle={searchTitle}
          setSearchTitle={setSearchTitle}
        />

        {/* ============== table ====================== */}
        <table className="table table-striped table-hover table-bordered align-middle text-center mb-0 ">
          <thead className="table table-success table-custom  tableEnhance">
            <tr>
              <th className="thPSEnhance1">
                <span>Title</span>
                <i className="bi bi-chevron-expand ms-1 "></i>
              </th>
              <th className="thPSEnhance2">
                <span>Description</span>
                <i className="bi bi-chevron-expand ms-1 "></i>
              </th>

              <th className="thPSEnhance3">
                <span>Num Tasks</span>
                <i className="bi bi-chevron-expand ms-1 "></i>
              </th>
              <th className="thPSEnhance4">
                <span>Date Created</span>
                <i className="bi bi-chevron-expand ms-1 "></i>
              </th>
              {loginData?.userGroup != "Employee" && (
                <th className="thPSEnhance5">
                  <span>Actions</span>
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center text-muted py-4">
                  <div className="my-5">
                    <i className="fa fa-spinner fa-spin fa-5x"></i>
                  </div>
                </td>
              </tr>
            ) : allProjects.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-muted py-4">
                  <div className="my-5 mx-auto w-100 d-flex justify-content-center">
                    <h3 className="text-muted">
                      Found no
                      {searchTitle ? ` with Title "${searchTitle}"` : ""}
                    </h3>
                  </div>
                </td>
              </tr>
            ) : (
              allProjects.map((project: ProjectType) => (
                <tr key={project.id}>
                  <td>{project.title}</td>
                  <td>{project.description}</td>
                  <td>{project.task.length}</td>
                  <td>{new Date(project.creationDate).toLocaleDateString()}</td>
                  {loginData?.userGroup != "Employee" && 
                  (
                    <td>
                      <div className="dropdown">
                        <button
                          className="btn  border-0"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <HiOutlineDotsHorizontal size={20} />
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end shadow  border-0">
                          <li>
                            <button
                              className="dropdown-item d-flex align-items-center gap-2 text-success"
                              onClick={() =>
                                navigate(`/projects/edit/${project.id}`)
                              }
                            >
                              <FiEdit size={18} /> Edit
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => {
                                setSelectedProject(project);
                                // setModalType("delete");
                                setShowDeleteModal(true);
                              }}
                              className="dropdown-item d-flex align-items-center gap-2 text-danger"
                            >
                              <RiDeleteBin6Line
                                size={18}
                                className="text-danger"
                              />
                              Delete
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
        <Pagination
          pageNumber={pageNumber}
          pageSize={pageSize}
          setPageNumber={setPageNumber}
          setPageSize={setPageSize}
          totalNumberOfRecords={totalNumberOfRecords || 0}
          totalPages={totalPages}
        />
      </div>
      {/* Modal delete Logic */}
      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          if (selectedProject)
            onDeleteProject(selectedProject.id, () =>
              setShowDeleteModal(false)
            );
        }}
        itemName={selectedProject?.title}
        title="Delete Project"
        isSubmitting={isSubmitting}
      />
    </>
  );
}
