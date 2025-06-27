import { PROJECT_URLS } from "@/service/api";
import { TASK_URLS, USERS_URL } from "@/service/api";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import type {
  UserType,
  TaskType,
  ProjectType,
  TaskFormInputs,
} from "@/interfaces/interfaces";
import { axiosInstance } from "@/service/urls";
import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useMode } from "@/store/ModeContext/ModeContext";

export default function TaskForm() {
  const navigate = useNavigate();
  const { darkMode } = useMode();

  const { id } = useParams();
  // console.log("Task ID:", id);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormInputs>({ mode: "onChange" });

  // =========== states ==========
  const [usersList, setUsersList] = useState<UserType[]>([]);
  const [usersPage, setUsersPage] = useState<number>(1);
  const [usersHasMore, setUsersHasMore] = useState<boolean>(false);
  const [projectsList, setProjectsList] = useState<ProjectType[]>([]);
  const [projectPage, setProjectPage] = useState<number>(1);
  const [projectHasMore, setProjectHasMore] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const pageSize = 1000; // Define a constant for page size
  const [task, setTask] = useState<TaskType | undefined>(undefined);

  // =========== fetch projects ==========

  const fetchProjects = async (page = 1, pageSize = 1000) => {
    try {
      const response = await axiosInstance.get(
        PROJECT_URLS.GET_PROJECTS_BY_MANAGER,
        {
          params: {
            page,
            pageSize,
          },
        }
      );

      const { data, totalNumberOfRecords } = response.data; // Assuming your API returns data and total count

      // Return both the new projects and whether more are available
      return {
        newProjects: data,
        moreAvailable: page * pageSize < totalNumberOfRecords,
      };
    } catch (error) {
      toast.error("Failed to load projects data");
      console.error("Error fetching projects data:", error);
      return {
        newProjects: [],
        moreAvailable: false,
      };
    }
  };

  const loadInitialProjects = async () => {
    setLoading(true);
    const { newProjects, moreAvailable } = await fetchProjects(1, pageSize);
    setProjectsList(newProjects);
    setProjectHasMore(moreAvailable);
    setLoading(false);
  };

  const loadMoreProjects = async () => {
    if (!projectHasMore) return;

    const nextPage = projectPage + 1;
    const { newProjects, moreAvailable } = await fetchProjects(
      nextPage,
      pageSize
    );

    setProjectsList((prev) => [...prev, ...newProjects]);
    setProjectHasMore(moreAvailable);
    setProjectPage(nextPage);
  };

  // const fetchProjects = async () => {
  //     try {
  //         const response = await axiosInstance.get(
  //             PROJECT_URLS.GET_PROJECTS_BY_MANAGER
  //         );
  //         // todo: delete this
  //         toast.success("projects fetched successfully");
  //         console.log(response);
  //         setProjectsList(response.data.data);
  //     } catch (error) {
  //         toast.error("Failed to load projects data");
  //         console.error("Error fetching projects data:", error);
  //     }
  // };

  // =========== fetch users ==========
  const fetchUsers = async (page = 1, pageSize = 1000) => {
    try {
      const response = await axiosInstance.get(USERS_URL.GET_ALL_USERS, {
        params: {
          page,
          pageSize,
        },
      });

      const { data, totalNumberOfRecords } = response.data; // Assuming your API returns data and total count

      // Return both the new projects and whether more are available
      return {
        newRecords: data,
        moreAvailable: page * pageSize < totalNumberOfRecords,
      };
    } catch (error) {
      toast.error("Failed to load users data");
      console.error("Error fetching users data:", error);
      return {
        newProjects: [],
        moreAvailable: false,
      };
    }
  };

  const loadInitialUsers = async () => {
    setLoading(true);
    const { newRecords, moreAvailable } = await fetchUsers(1, pageSize);
    setUsersList(newRecords);
    setUsersHasMore(moreAvailable);
    setLoading(false);
  };

  const loadMoreUsers = async () => {
    if (!usersHasMore) return;

    const nextPage = usersPage + 1;
    const { newRecords, moreAvailable } = await fetchUsers(nextPage, pageSize);

    setUsersList((prev) => [...prev, ...newRecords]);
    setUsersHasMore(moreAvailable);
    setUsersPage(nextPage);
  };

  // const fetchUsers = async () => {
  //     try {
  //         const usersResponse = await axiosInstance.get(
  //             USERS_URL.GET_ALL_USERS
  //         );
  //         // todo: delete this
  //         toast.success("users fetched successfully");
  //         console.log(usersResponse);
  //         setUsersList(usersResponse.data.data);
  //     } catch (error) {
  //         toast.error("Failed to load users data");
  //         console.error("Error fetching users data:", error);
  //     }
  // };

  // =========== fetch task data if id exists ==========
  const fetchTask = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(TASK_URLS.GET_TASK(Number(id)));
      // console.log(response.data);
      setTask(response.data);
      const { title, description, employee, project } = response.data;
      reset({
        title,
        description,
        employeeId: employee.id,
        projectId: project.id,
      }); // put data into form
      // console.log("Fetched task data:", response.data);
    } catch (error) {
      toast.error("Failed to load task data");
      console.error("Error fetching task data:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========== submit task form ==========
  const onSubmitTask = async (data: TaskFormInputs) => {
    try {
      if (id) {
        // Update existing task
        await axiosInstance.put(TASK_URLS.UPDATE_TASK(Number(id)), data);
        toast.success("Task updated");
        // navigate back to last page
        navigate(-1);
        return;
      } else {
        // Create new task
        await axiosInstance.post(TASK_URLS.CREATE_TASK, data);
        toast.success("Task created");
        navigate(-1);
      }
    } catch (error:any) {
      toast.error(error?.response?.data?.message ||"Something went wrong!");
    }
  };

  useEffect(
    () => {
      loadInitialUsers();
      loadInitialProjects();
      if (id) {
        fetchTask(); // Fetch task data if editing
      } else {
        reset(); // Reset form for new task
      }
      // setLoading(false);
    },
    [id, reset] // Run effect when id changes or on initial render
  );

  // =========== Render form ==========
  if (!id && !reset) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  return (
    <>
      <div
        className={`d-flex  flex-column px-5 py-4 mb-5 ${
          darkMode ? "bg-dark" : "bg-white"
        } border border-start-0`}
      >
        <div
          onClick={() => navigate(-1)}
          className="d-flex align-items-center  gap-3 mb-3 text-muted cursorEnhance"
          
        >
          <i className="fa-solid fa-angle-left"></i>
          <small>View All Tasks</small>
        </div>
        <h3>{id ? "Edit Task" : "Add a New Task"}</h3>
      </div>

      {/* Form Container */}
      <div
        className={`${
          darkMode ? "bg-dark" : "bg-white"
        } p-5 rounded-4 shadow w-75 mx-auto `}
      >
        <form onSubmit={handleSubmit(onSubmitTask)}>
          {/* Title */}

          <div className="mb-4">
            <label htmlFor="title" className="form-label fw-light ">
              Title
            </label>
            {(loading && <Skeleton height={30} />) || (
              <input
                type="text"
                placeholder="Name"
                className={`form-control rounded-pill  ${
                  darkMode ? "bg-dark border-1" : "bg-light border-0"
                } px-4 py-2`}
                {...register("title", {
                  required: "Task Title is required",
                })}
              />
            )}
            {errors.title && (
              <p className="text-danger mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="form-label fw-light ">
              Description
            </label>
            {(loading && <Skeleton height={80} />) || (
              <textarea
                rows={3}
                placeholder="Description"
                className={`form-control rounded-4  ${
                  darkMode ? "bg-dark border-1" : "bg-light border-0"
                } px-4 py-2`}
                {...register("description", {
                  required: "Description is required",
                })}
              ></textarea>
            )}
            {errors.description && (
              <p className="text-danger mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="d-flex w-100 gap-2">
            {/* User */}
            <div className="mb-4 flex-grow-1">
              <div className="position-relative">
                <label htmlFor="project" className="form-label fw-light ">
                  User
                </label>
                {(loading && <Skeleton height={30} />) || (
                  <select
                    id="user"
                    className={`form-select rounded-pill ${
                      darkMode
                        ? "bg-dark border-1 text-light"
                        : "bg-light border-0 text-dark"
                    } border-0 px-4 py-2`}
                    {...register("employeeId", {
                      required: "User is required",
                    })}
                  >
                    <option value="">Select User</option>
                    {task && task.employee && (
                      <option value={task.employee.id}>
                        {task.employee.userName}
                      </option>
                    )}
                    {(task
                      ? usersList.filter(
                          (user: UserType) => user.id !== task?.user?.id
                        )
                      : usersList
                    )
                      .sort((a, b) => a.userName.localeCompare(b.userName))
                      .map((user: UserType) => (
                        <option
                          key={user.id}
                          value={user.id}
                        >{`${user.userName}`}</option>
                      ))}
                  </select>
                )}
              </div>
              {errors.employeeId && (
                <p className="text-danger mt-1">{errors.employeeId.message}</p>
              )}
            </div>

            {/* Project */}
            <div className="mb-4 flex-grow-1">
              <label htmlFor="project" className="form-label fw-light ">
                Project
              </label>
              {(loading && <Skeleton height={30} />) || (
                <select
                  id="project"
                  className={`form-select rounded-pill  ${
                    darkMode
                      ? "bg-dark border-1 text-light"
                      : "bg-light border-0 text-dark"
                  } border-0 px-4 py-2`}
                  {...register("projectId", {
                    required: "Project is required",
                  })}
                  disabled={task?.project?.id ? true : false}
                  style={{
                    cursor: task?.project?.id ? "not-allowed" : "pointer",
                  }}
                >
                  <option value="">Select Project</option>
                  {task && task.project && (
                    <option value={task?.project?.id}>
                      {task.project.title}
                    </option>
                  )}
                  {(
                    (task &&
                      projectsList.filter(
                        (project: ProjectType) => project.id !== task.project.id
                      )) ||
                    projectsList
                  )
                    .sort((a, b) => a.title.localeCompare(b.title))
                    .map((project: ProjectType) => (
                      <option
                        key={project.id}
                        value={project.id}
                      >{`${project.title}`}</option>
                    ))}
                </select>
              )}
              {errors.projectId && (
                <p className="text-danger mt-1">{errors.projectId.message}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-top pt-4 d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-outline-dark rounded-pill px-4"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-lg text-white rounded-pill px-4 bg-orange"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="spinner-border spinner-border-sm" />
              ) : id ? (
                "Update Task"
              ) : (
                "Create Task"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
