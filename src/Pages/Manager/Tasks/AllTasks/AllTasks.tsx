import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { TASK_URLS } from "@/service/api";
import { axiosInstance } from "@/service/urls";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import DeleteModal from "@/components/DeleteModal/DeleteModal";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAuth } from "@/store/AuthContext/AuthContext";
const StatusInfo = ({ status }:any) => {
    const inProgressBgColor = "#EF9B28";
    const doneBgColor = "#009247";
    const todoBgColor = "#E4E1F5";
    let taskStatus;
    let bgColor;
    switch (status) {
        case "ToDo":
            bgColor = todoBgColor;
            taskStatus = "To Do";
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
            style={{ backgroundColor: bgColor }}
        >
            {taskStatus}
        </span>
    );
};

export default function AllTasks() {
    //=======  hooks ==============
    const {loginData} :any = useAuth();
    const navigate = useNavigate();
    //=======  states ==============
    const [allTasks, setAllTasks] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");
    const [pageSize, setPageSize] = useState(3);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [totalNumberOfRecords, setTotalNumberOfRecords] = useState();

    //=======  get all projects ==============
    const getAllTasks = async (
        title = "",
        // status = undefined,
        pageSizeValue = pageSize,
        page = pageNumber
    ) => {
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
            console.log(response);
            console.log(response.data.totalNumberOfRecords);
            setAllTasks(response.data.data);
            setTotalPages(response.data.totalNumberOfPages);
            setTotalNumberOfRecords(response.data.totalNumberOfRecords);
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(
                    error?.response?.data.message || "Something went wrong!"
                );
            }
        } finally {
            setLoading(false);
        }
    };

    // --------------- delete project -------------
    const onDeleteTask = async (id: number, onSuccess: any) => {
        try {
            setIsSubmitting(true);
            await axiosInstance.delete(TASK_URLS.DELETE_TASK(id));
            toast.success("Task Deleted Successfully");
            onSuccess();
            getAllTasks();
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Failed to delete Task."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    //=======  useEffect ==============
    useEffect(() => {
         if (loginData?.userGroup != 'Manager') {

      navigate("/dashboard");      
    }
        setPageNumber(1); // Reset to first page when search changes
    }, [searchTitle, pageSize]);

    useEffect(() => {
        getAllTasks(searchTitle, pageSize, pageNumber);
        console.log(totalNumberOfRecords);
    }, [searchTitle, pageSize, pageNumber]);

    return (
        <>
            <div className="d-flex justify-content-between align-items-center px-5 py-4 mb-4 bg-white border border-start-0">
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
                            <th style={{ width: "20%" }}>
                                <span>Status</span>
                                <i className="bi bi-chevron-expand ms-1 "></i>
                            </th>

                            <th style={{ width: "15%" }}>
                                <span>User</span>
                                <i className="bi bi-chevron-expand ms-1 "></i>
                            </th>
                            <th style={{ width: "20%" }}>
                                <span>Project</span>
                                <i className="bi bi-chevron-expand ms-1 "></i>
                            </th>
                            <th style={{ width: "20%" }}>
                                <span>Date Created</span>
                                <i className="bi bi-chevron-expand ms-1 "></i>
                            </th>
                            <th style={{ width: "25%" }}>
                                <span>Actions</span>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {allTasks.map((task: any) => (
                            <tr key={task.id}>
                                <td>{task.title}</td>
                                <td>
                                    <StatusInfo status={task.status} />
                                </td>
                                <td>{task.employee.userName}</td>
                                <td>{task.project.title}</td>
                                <td>
                                    {new Date(
                                        task.creationDate
                                    ).toLocaleDateString()}
                                </td>
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
                                                        navigate(
                                                            `/tasks/edit/${task.id}`
                                                        )
                                                    }
                                                >
                                                    <i className="bi bi-pencil-square"></i>{" "}
                                                    Edit
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={() => {
                                                        setSelectedTask(
                                                            task.id
                                                        );
                                                        // setModalType("delete");
                                                        setShowDeleteModal(
                                                            true
                                                        );
                                                    }}
                                                    className="dropdown-item d-flex align-items-center gap-2 text-danger"
                                                >
                                                    <i className="bi bi-trash"></i>{" "}
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
                                <td
                                    colSpan={6}
                                    className="text-center text-muted py-4"
                                >
                                    <div className="my-5">
                                        <i className="fa fa-spinner fa-spin fa-5x"></i>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {allTasks.length === 0 && !loading && (
                    <h5 className="text-muted text-center p-3 fs-2">
                        Found No Tasks!
                    </h5>
                )}
                {/* ============== pagination ====================== */}
                <div className="d-flex justify-content-end align-items-center p-3    gap-5">
                    <div className="d-flex align-items-center gap-2">
                        <span>Showing</span>
                        <select
                            className="form-select border rounded-pill px-3 py-1"
                            style={{ width: "80px" }}
                            value={pageSize}
                            onChange={(e) =>
                                setPageSize(Number(e.target.value))
                            }
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
                                onClick={() =>
                                    setPageNumber((prev) =>
                                        Math.max(prev - 1, 1)
                                    )
                                }
                            >
                                <i className="bi bi-chevron-left fs-5 text-secondary"></i>
                            </button>
                            <button
                                className="btn btn-white border-0 p-1"
                                disabled={pageNumber === totalPages}
                                onClick={() =>
                                    setPageNumber((prev) =>
                                        Math.min(prev + 1, totalPages)
                                    )
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
                    onDeleteTask(selectedTask, () => setShowDeleteModal(false))
                }
                itemName={
                    allTasks.find((task: any) => task.id === selectedTask)
                        ?.title
                }
                title="Delete Task"
                isSubmitting={isSubmitting}
            />
        </>
    );
}
