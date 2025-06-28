import { TASK_URLS } from "@/service/api";
import type { TaskType } from "@/interfaces/interfaces";
import { axiosInstance } from "@/service/urls";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useMode } from "@/store/ModeContext/ModeContext";
import { isAxiosError } from "axios";

export default function TaskDetails() {
  const { id } = useParams();
  const { darkMode } = useMode();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState<TaskType | undefined>(undefined);

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  const fetchTask = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(TASK_URLS.GET_TASK(Number(id)));
      setTask(response.data);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(
          error?.response?.data?.message || "Failed to load task data"
        );
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  return (
    <div
      className={`max-vh-100 ${darkMode ? "bg-dark text-light" : "bg-light"}`}
    >
      {/* Header Section */}
      <header className={`${darkMode ? "bg-dark" : "bg-white"} shadow-sm py-3`}>
        <div className="container">
          <div className="d-flex align-items-center">
            <button
              onClick={() => navigate(-1)}
              className={`btn btn-link ${
                darkMode ? "text-light" : "text-dark"
              } text-decoration-none`}
            >
              <i className="fas fa-arrow-left me-2"></i>
              Back to Tasks
            </button>
          </div>
        </div>
      </header>

      <main className="container py-4">
        <h2 className="mb-4 fw-bold">Task Details</h2>

        {loading ? (
          <TaskDetailsSkeleton darkMode={darkMode} />
        ) : task ? (
          <div className="row g-4">
            {/* Employee Card */}
            <div className="col-md-4">
              <div
                className={`card ${
                  darkMode ? "bg-dark-gray" : "bg-white"
                } h-100 shadow-sm`}
              >
                <div className="card-body text-center">
                  <h5 className="card-title mb-4">Assigned To</h5>
                  <div className="mb-3">
                    <img
                      src="/profile.jpeg"
                      alt="User"
                      className="rounded-circle border border-3"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <DetailItem label="Name" value={task.employee.userName} />
                  <DetailItem label="Email" value={task.employee.email} />
                </div>
              </div>
            </div>

            {/* Task Details Card */}
            <div className="col-md-8">
              <div
                className={`card ${
                  darkMode ? "bg-dark-gray" : "bg-white"
                } shadow-sm`}
              >
                <div className="card-body">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <SectionHeader title="Task Information" />
                      <DetailItem label="Title" value={task.title} />
                      <DetailItem
                        label="Description"
                        value={task.description}
                      />
                      <DetailItem
                        label="Status"
                        value={
                          <span
                            className={`badge ${getStatusBadgeClass(
                              task.status
                            )}`}
                          >
                            {task.status}
                          </span>
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <SectionHeader title="Timeline" />
                      <DetailItem
                        label="Created"
                        value={new Date(task.creationDate).toLocaleString(
                          "en",
                          dateOptions
                        )}
                      />
                      <DetailItem
                        label="Last Modified"
                        value={new Date(task.modificationDate).toLocaleString(
                          "en",
                          dateOptions
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Details Card */}
              <div
                className={`card mt-4 ${
                  darkMode ? "bg-dark-gray" : "bg-white"
                } shadow-sm`}
              >
                <div className="card-body">
                  <SectionHeader title="Project Details" />
                  <div className="row g-4">
                    <div className="col-md-6">
                      <DetailItem
                        label="Project Title"
                        value={task.project.title}
                      />
                      <DetailItem
                        label="Description"
                        value={task.project.description}
                      />
                    </div>
                    <div className="col-md-6">
                      <DetailItem
                        label="Created"
                        value={new Date(
                          task.project.creationDate
                        ).toLocaleString("en", dateOptions)}
                      />
                      <DetailItem
                        label="Last Modified"
                        value={new Date(
                          task.project.modificationDate
                        ).toLocaleString("en", dateOptions)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="alert alert-warning">No task data available</div>
        )}
      </main>
    </div>
  );
}

// Helper Components
const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="mb-3">
    <h6 className="text-muted mb-1">{label}</h6>
    <p className="mb-0">{value}</p>
  </div>
);

const SectionHeader = ({ title }: { title: string }) => (
  <h5 className="mb-4 fw-bold border-bottom pb-2">{title}</h5>
);

const TaskDetailsSkeleton = ({ darkMode }: { darkMode: boolean }) => (
  <div className="row g-4">
    <div className="col-md-4">
      <div className={`card ${darkMode ? "bg-dark-gray" : "bg-white"} h-100`}>
        <div className="card-body text-center">
          <Skeleton height={28} width={120} className="mb-4 mx-auto" />
          <Skeleton circle width={100} height={100} className="mb-3 mx-auto" />
          <Skeleton count={2} height={20} className="mb-2" />
        </div>
      </div>
    </div>
    <div className="col-md-8">
      <div className={`card ${darkMode ? "bg-dark-gray" : "bg-white"} mb-4`}>
        <div className="card-body">
          <Skeleton height={28} width={150} className="mb-4" />
          <div className="row">
            <div className="col-md-6">
              <Skeleton count={4} height={20} className="mb-3" />
            </div>
            <div className="col-md-6">
              <Skeleton count={2} height={20} className="mb-3" />
            </div>
          </div>
        </div>
      </div>
      <div className={`card ${darkMode ? "bg-dark-gray" : "bg-white"}`}>
        <div className="card-body">
          <Skeleton height={28} width={150} className="mb-4" />
          <div className="row">
            <div className="col-md-6">
              <Skeleton count={2} height={20} className="mb-3" />
            </div>
            <div className="col-md-6">
              <Skeleton count={2} height={20} className="mb-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Helper function for status badges
const getStatusBadgeClass = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-success";
    case "in progress":
      return "bg-primary";
    case "pending":
      return "bg-warning text-dark";
    default:
      return "bg-secondary";
  }
};
