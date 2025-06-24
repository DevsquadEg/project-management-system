import { PROJECT_URLS } from "@/service/api";
import { axiosInstance } from "@/service/urls";
import { useMode } from "@/store/ModeContext/ModeContext";
import { useEffect } from "react";

import { useForm } from "react-hook-form";

import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

type ProjectFormInputs = {
  title: string;
  description: string;
};

export default function ProjectForm() {
  const navigate = useNavigate();
  const { darkMode } = useMode();

  const { id } = useParams();
  console.log("Project ID:", id);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormInputs>({ mode: "onChange" });

  // =========== fetch project data if id exists ==========
  const fetchProject = async () => {
    try {
      const response = await axiosInstance.get(
        PROJECT_URLS.GET_PROJECT(Number(id))
      );
      const { title, description } = response.data;
      reset({ title, description }); // put data into form
      console.log("Fetched project data:", response.data);
    } catch (error) {
      toast.error("Failed to load project data");
      console.error("Error fetching project data:", error);
    }
  };

  // =========== submit project form ==========
  const onSubmitProject = async (data: ProjectFormInputs) => {
    try {
      if (id) {
        // Update existing project
        await axiosInstance.put(PROJECT_URLS.UPDATE_PROJECT(Number(id)), data);
        toast.success("Project updated");
        navigate("/projects-manage");
        return;
      } else {
        // Create new project
        await axiosInstance.post(PROJECT_URLS.CREATE_PROJECT, data);
        toast.success("Project created");
        navigate("/projects-manage");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  useEffect(
    () => {
      if (id) {
        fetchProject(); // Fetch project data if editing
      } else {
        reset(); // Reset form for new project
      }
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
          onClick={() => navigate("/projects-manage")}
          className="d-flex align-items-center  gap-3 mb-3 text-muted"
          style={{ cursor: "pointer" }}
        >
          <i className="fa-solid fa-angle-left"></i>
          <small>View All Projects</small>
        </div>
        <h3>{id ? "Edit Project" : "Add a New Project"}</h3>
      </div>

      {/* Form Container */}
      <div
        className={`${
          darkMode ? "bg-dark" : "bg-white"
        } p-5 rounded-4 shadow w-75 mx-auto `}
      >
        <form onSubmit={handleSubmit(onSubmitProject)}>
          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="form-label fw-light ">
              Title
            </label>
            <input
              type="text"
              placeholder="Name"
              className={`form-control rounded-pill ${
                darkMode ? "bg-dark border-1" : "bg-light border-0"
              }  px-4 py-2`}
              {...register("title", {
                required: "Project Title is required",
              })}
            />
            {errors.title && (
              <p className="text-danger mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="form-label fw-light ">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Description"
              className={`form-control rounded-4  ${
                darkMode ? "bg-dark border-1" : "bg-light border-0"
              } px-4 py-2`}
              {...register("description", {
                required: "Description is required",
              })}
            ></textarea>
            {errors.description && (
              <p className="text-danger mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="border-top pt-4 d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-outline-dark rounded-pill px-4"
              onClick={() => navigate("/projects-manage")}
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
                "Update Project"
              ) : (
                "Create Project"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
