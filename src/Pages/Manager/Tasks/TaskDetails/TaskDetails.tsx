import { imgBaseURL, TASK_URLS } from "@/service/api";
import type { TaskType } from "@/service/types";
import { axiosInstance } from "@/service/urls";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function TaskDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [task, setTask] = useState<TaskType | undefined>(undefined);

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    };

    const fetchTask = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(
                TASK_URLS.GET_TASK(Number(id))
            );
            console.log(response.data);
            setTask(response.data);
            // const { title, description, employee, project } = response.data;
            console.log("Fetched task data:", response.data);
        } catch (error) {
            toast.error("Failed to load task data");
            console.error("Error fetching task data:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchTask();
    }, []);
    return (
        <>
            <div className="d-flex  flex-column px-5 py-4 mb-5 bg-white border border-start-0">
                <div
                    onClick={() => navigate(-1)}
                    className="d-flex align-items-center  gap-3 mb-3 text-muted"
                    style={{ cursor: "pointer" }}
                >
                    <i className="fa-solid fa-angle-left"></i>
                    <small>View All Tasks</small>
                </div>
                <h3>View Task Details</h3>
            </div>
            {/* show skeleton when loading */}
            {loading && (
                <div className="d-flex bg-white border border-start-0 px-5 py-4 mb-5 justify-content-between">
                    {/* Left Column - Task & Project Details */}
                    <div className="flex-grow-1">
                        {/* Task Details */}
                        <div className="mb-4">
                            <Skeleton
                                height={28}
                                width={150}
                                className="mb-3"
                            />
                            <DetailRowSkeleton count={5} />
                        </div>

                        {/* Project Details */}
                        <div>
                            <Skeleton
                                height={28}
                                width={150}
                                className="mb-3"
                            />
                            <DetailRowSkeleton count={4} />
                        </div>
                    </div>

                    {/* Right Column - Assigned Employee */}
                    <div className="employee-skeleton">
                        <Skeleton
                            height={28}
                            width={180}
                            className="mb-3 text-center"
                        />
                        <Skeleton
                            circle
                            width={100}
                            height={100}
                            className="mx-auto mb-3"
                            style={{ minWidth: "100px" }}
                        />
                        <DetailRowSkeleton count={2} align="center" />
                    </div>
                </div>
            )}

            {/* display task data [title, description, status, modification data, creation date, project [title, description, creation date, modification date], employee [userName, email]] */}
            {task && (
                <div className="d-flex bg-white border border-start-0 px-5 py-4 mb-5 justify-content-between">
                    <div className="d-flex flex-column gap-3">
                        <div className="d-flex flex-column">
                            <h5>Task Details</h5>
                            <div className="d-flex align-items-center gap-3">
                                <span className="fw-bold">Title:</span>
                                <span>{task.title}</span>
                            </div>
                            <div className="d-flex align-items-center gap-3">
                                <span className="fw-bold">Description:</span>
                                <span>{task.description}</span>
                            </div>
                            <div className="d-flex align-items-center gap-3">
                                <span className="fw-bold">Status:</span>
                                <span>{task.status}</span>
                            </div>
                            <div className="d-flex align-items-center gap-3">
                                <span className="fw-bold">Created At:</span>
                                <span>
                                    {new Date(task.creationDate).toLocaleString(
                                        "en",
                                        options
                                    )}
                                </span>
                            </div>
                            <div className="d-flex align-items-center gap-3">
                                <span className="fw-bold">
                                    Last Modified At:
                                </span>
                                <span>
                                    {new Date(
                                        task.modificationDate
                                    ).toLocaleString("en", options)}
                                </span>
                            </div>
                        </div>
                        <div className="d-flex flex-column">
                            <h5>Project Details</h5>
                            <div className="d-flex align-items-center gap-3">
                                <span className="fw-bold">Title:</span>
                                <span>{task.project.title}</span>
                            </div>
                            <div className="d-flex align-items-center gap-3">
                                <span className="fw-bold">Description:</span>
                                <span>{task.project.description}</span>
                            </div>
                            <div className="d-flex align-items-center gap-3">
                                <span className="fw-bold">Created At:</span>
                                <span>
                                    {new Date(
                                        task.project.creationDate
                                    ).toLocaleString("en", options)}
                                </span>
                            </div>
                            <div className="d-flex align-items-center gap-3">
                                <span className="fw-bold">
                                    Last Modified At:
                                </span>
                                <span>
                                    {new Date(
                                        task.project.modificationDate
                                    ).toLocaleString("en", options)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-column align-items-center">
                        <h5>Assigned To</h5>
                        {/* employee image */}
                        <div
                            className="img-container rounded-circle d-flex justify-content-center border-1 overflow-auto"
                            style={{
                                border: "1px solid #ef9b28",
                                width: "100px",
                                height: "100px",
                            }}
                        >
                            <img
                                src={`${imgBaseURL}/${
                                    task.employee.imagePath ||
                                    "files/users/images/806profile.jpeg"
                                }`}
                                alt="User"
                                className="img-fluid object-fit-cover"
                            />
                        </div>
                        <div className="p-2">
                            <div className="d-flex align-items-center gap-3">
                                <span className="fw-bold">User Name:</span>
                                <span>{task.employee.userName}</span>
                            </div>
                            <div className="d-flex align-items-center gap-3">
                                <span className="fw-bold">Email:</span>
                                <span>{task.employee.email}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

const DetailRowSkeleton = ({ count = 1, align = "start" }) => (
    <div className={`d-flex flex-column gap-2 text-${align}`}>
        {[...Array(count)].map((_, i) => (
            <div key={i} className="d-flex align-items-center gap-3">
                <Skeleton height={18} width={100} />
                <Skeleton height={18} width={i % 2 === 0 ? "65%" : "50%"} />
            </div>
        ))}
    </div>
);
