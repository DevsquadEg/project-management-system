import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { TASK_URLS } from "@/service/api";
import { axiosInstance } from "@/service/urls";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import DeleteModal from "@/components/DeleteModal/DeleteModal";
import "react-loading-skeleton/dist/skeleton.css";
import { useMode } from "@/store/ModeContext/ModeContext";
import { useAuth } from "@/store/AuthContext/AuthContext";
import { Helmet } from "react-helmet-async";
import { FiEdit, FiEye } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import type { TaskType } from "@/interfaces/interfaces";
import Search from "@/components/shared/Search";
import Pagination from "@/components/shared/Pagination";
const StatusInfo = ({
  status,
  darkMode,
}: {
  status: "ToDo" | "InProgress" | "Done";
  darkMode: boolean;
}) => {
  const inProgressBgColor = "#EF9B28";
  const doneBgColor = "#009247";
  const todoBgColor = "#E4E1F5";
  let textColor = "#fff";
  let taskStatus;
  let bgColor;
  switch (status) {
    case "ToDo":
      bgColor = todoBgColor;
      taskStatus = "To Do";
      textColor = darkMode ? "#EF9B28" : "#fff";
      break;
    case "InProgress":
      bgColor = inProgressBgColor;
      taskStatus = "In Progress";
      break;
    case "Done":
      bgColor = doneBgColor;
      taskStatus = "Done";
      break;
  }

  return (
    <span
      className={`badge px-3 py-2 rounded-5`}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {taskStatus}
    </span>
  );
};

export default function AllTasks() {
  //=======  hooks ==============
  const { loginData } = useAuth();
  const navigate = useNavigate();
  //=======  states ==============
  const [allTasks, setAllTasks] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [pageSize, setPageSize] = useState(3);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskType>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalNumberOfRecords, setTotalNumberOfRecords] = useState(0);

  const { darkMode } = useMode();

  //=======  get all projects ==============
  const getAllTasks = useCallback(
    async (title = "") => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          TASK_URLS.GET_TASKS_BY_MANAGER,
          {
            params: {
              title: title,
              status,
              pageSize: pageSize,
              pageNumber: pageNumber,
            },
          }
        );
        // // console.log(response);
        // // console.log(response.data.totalNumberOfRecords);
        setAllTasks(response.data.data);
        setTotalPages(response.data.totalNumberOfPages);
        setTotalNumberOfRecords(response.data.totalNumberOfRecords);
      } catch (error) {
        if (isAxiosError(error)) {
          toast.error(
            error?.response?.data?.message || "Something went wrong!"
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [pageNumber, pageSize]
  );
  // --------------- delete task -------------
  const onDeleteTask = async (
    id: number | undefined,
    onSuccess: () => void
  ) => {
    if (id) {
      try {
        setIsSubmitting(true);

        await axiosInstance.delete(TASK_URLS.DELETE_TASK(id));
        toast.success("Task Deleted Successfully");
        onSuccess();
        getAllTasks();
      } catch (error) {
        if (isAxiosError(error)) {
          toast.error(
            error.response?.data?.message || "Failed to delete Task."
          );
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  //=======  useEffect ==============
  useEffect(() => {
    if (loginData?.userGroup != "Manager") {
      navigate("/dashboard");
    }
    setPageNumber(1); // Reset to first page when search changes
  }, [searchTitle, pageSize, loginData, navigate]);

  useEffect(() => {
    getAllTasks(searchTitle);
    // // console.log(totalNumberOfRecords);
  }, [searchTitle, pageSize, pageNumber, getAllTasks, totalNumberOfRecords]);

  return (
    <>
      <Helmet>
        <title>All-Projects | Project Management System</title>
        <meta
          name="description"
          content="Manage Tasks within your project management system. View user details, edit, or remove tasks."
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
        <h2>Tasks</h2>
        <div>
          <button
            onClick={() => navigate("/tasks/add")}
            className="btn btn-lg bg-orange rounded-pill text-white px-5"
          >
            add new Task
          </button>
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
          <thead className="table table-success table-custom tableEnhance">
            <tr>
              <th className="thPSEnhanceTask1">
                <span>Title</span>
                <i className="bi bi-chevron-expand ms-1 "></i>
              </th>
              <th className="thPSEnhanceTask2">
                <span>Status</span>
                <i className="bi bi-chevron-expand ms-1 "></i>
              </th>

              <th className="thPSEnhanceTask3">
                <span>User</span>
                <i className="bi bi-chevron-expand ms-1 "></i>
              </th>
              <th className="thPSEnhanceTask2">
                <span>Project</span>
                <i className="bi bi-chevron-expand ms-1 "></i>
              </th>
              <th className="thPSEnhanceTask2">
                <span>Date Created</span>
                <i className="bi bi-chevron-expand ms-1 "></i>
              </th>
              <th className="thPSEnhanceTask1">
                <span>Actions</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {allTasks.map((task: TaskType) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>
                  <StatusInfo status={task.status} darkMode={darkMode} />
                </td>
                <td>{task.employee.userName}</td>
                <td>{task.project.title}</td>
                <td>{new Date(task.creationDate).toLocaleDateString()}</td>
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
                          onClick={
                            () => navigate(`/tasks/${task.id}`)
                            // // console.log(task.id)
                          }
                        >
                          <FiEye size={18} className="text-success" /> View
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item d-flex align-items-center gap-2 text-success"
                          onClick={() => navigate(`/tasks/edit/${task.id}`)}
                        >
                          <FiEdit size={18} /> Edit
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setSelectedTask(task);
                            // setModalType("delete");
                            setShowDeleteModal(true);
                          }}
                          className="dropdown-item d-flex align-items-center gap-2 text-danger"
                        >
                          <RiDeleteBin6Line size={18} className="text-danger" />
                          Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
            {loading && allTasks.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-muted py-4">
                  <div className="my-5">
                    <i className="fa fa-spinner fa-spin fa-5x"></i>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {allTasks.length === 0 && !loading && (
          <h5 className="text-muted text-center py-5 fs-2">
            Found no Tasks
            {searchTitle ? ` with Title "${searchTitle}"` : ""}
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
      {/* Modal delete Logic */}
      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() =>
          onDeleteTask(selectedTask?.id, () => setShowDeleteModal(false))
        }
        itemName={selectedTask?.title}
        title="Delete Task"
        isSubmitting={isSubmitting}
      />
    </>
  );
}
