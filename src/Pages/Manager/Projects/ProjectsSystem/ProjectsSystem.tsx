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
import type { AuthContextType, ProjectType } from "@/interfaces/interfaces";
import Pagination from "@/components/shared/Pagination";
import Search from "@/components/shared/Search";

export default function ProjectsSystem() {
  //=======  hooks ==============
  const navigate = useNavigate();
  const { darkMode } = useMode();
  //=======  states ==============
  const [allProjects, setAllProjects] = useState<ProjectType[]>([]);
  const [searchTitle, setSearchTitle] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(11);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<ProjectType>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [totalNumberOfRecords, setTotalNumberOfRecords] = useState<number>(0);

  //=======  deeplinking ==============
  const { loginData }: AuthContextType = useAuth();

  //=======  get all projects ==============
  const getProjectsSystem = useCallback(
    async (title = "", pageSizeValue = pageSize, page = pageNumber) => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          PROJECT_URLS.GET_ALL_PROJECTS,
          {
            params: {
              ...(title && { title }),
              pageSize: pageSizeValue,
              pageNumber: page,
            },
          }
        );
        // console.log(response.data);
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
    []
  );
  // --------------- delete project -------------
  const onDeleteProject = async (
    id: number | undefined,
    onSuccess: () => void
  ) => {
    try {
      setIsSubmitting(true);
      await axiosInstance.delete(PROJECT_URLS.DELETE_PROJECT(id));
      toast.success("Project Deleted Successfully");
      onSuccess();
      await getProjectsSystem();
    } catch (error: unknown) {
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
    getProjectsSystem(searchTitle, pageSize, pageNumber);
    // console.log(getProjectsSystem());
  }, [pageNumber, searchTitle, pageSize]);

  return (
    <>
      <Helmet>
        <title>All-Projects | Project Management System</title>
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
        <h2>All Projects System</h2>
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
          <thead className="table table-success table-custom tableEnhance">
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
                <span>Admin</span>
                <i className="bi bi-chevron-expand ms-1 "></i>
              </th>
              <th className="thPSEnhance4">
                <span>Date Created</span>
                <i className="bi bi-chevron-expand ms-1 "></i>
              </th>
              <th className="thPSEnhance5">
                <span>Actions</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {allProjects.length > 0 ? (
              allProjects.map((project: ProjectType) => (
                <tr key={project.id}>
                  <td>{project.title}</td>
                  <td>{project.description}</td>
                  <td>{project?.manager?.userName}</td>
                  <td>{new Date(project.creationDate).toLocaleDateString()}</td>
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
                            disabled={isSubmitting}
                            onClick={() => {
                              setSelectedProject(project);
                              setShowDeleteModal(true);
                            }}
                            className="dropdown-item d-flex align-items-center gap-2 text-danger"
                          >
                            <RiDeleteBin6Line
                              size={18}
                              className="text-danger"
                            />{" "}
                            Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))
            ) : loading ? (
              <tr>
                <td colSpan={5} className="text-center text-muted py-4">
                  <div className="my-5">
                    <i className="fa fa-spinner fa-spin fa-5x"></i>
                  </div>
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-muted py-4">
                  <h3 className="text-muted">
                    Found no Projects
                    {searchTitle ? ` with Title "${searchTitle}"` : ""}
                  </h3>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* ============== pagination ====================== */}
        <Pagination
          pageNumber={pageNumber}
          pageSize={pageSize}
          setPageNumber={setPageNumber}
          setPageSize={setPageSize}
          totalNumberOfRecords={totalNumberOfRecords}
          totalPages={totalPages}
        />
        {/* Modal delete Logic */}
        <DeleteModal
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() =>
            onDeleteProject(selectedProject?.id, () =>
              setShowDeleteModal(false)
            )
          }
          itemName={selectedProject?.title}
          title="Delete Project"
          isSubmitting={isSubmitting}
        />
      </div>
    </>
  );
}
