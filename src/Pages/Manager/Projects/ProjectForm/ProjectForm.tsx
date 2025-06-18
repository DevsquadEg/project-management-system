import { PROJECT_URLS } from "@/service/api";
import { axiosInstance } from "@/service/urls";

import { useForm } from "react-hook-form";

import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

type ProjectFormInputs = {
  title: string;
  description: string;
};

export default function ProjectForm() {
  const navigate = useNavigate();

  const { id } = useParams();
  console.log("Project ID:", id);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormInputs>({ mode: "onChange" });

  // =========== submit project form ==========
  const onSubmitProject = async (data: ProjectFormInputs) => {
    try {
      if (id) {
        // Update existing project
        await axiosInstance.put(PROJECT_URLS.UPDATE_PROJECT(Number(id)), data);
        toast.success("Project updated");
        navigate("/projects");
        return;
      } else {
        // Create new project
        await axiosInstance.post(PROJECT_URLS.CREATE_PROJECT, data);
        toast.success("Project created");
        navigate("/projects");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };
  return (
    <>
      <div className="d-flex  flex-column px-5 py-4 mb-5 bg-white border border-start-0">
        <div
          onClick={() => navigate("/projects")}
          className="d-flex align-items-center  gap-3 mb-3 text-muted"
          style={{ cursor: "pointer" }}
        >
          <i className="fa-solid fa-angle-left"></i>
          <small>View All Projects</small>
        </div>
        <h3>{id ? "Edit Project" : "Add a New Project"}</h3>
      </div>

      {/* Form Container */}
      <div className="bg-white p-5 rounded-4 shadow w-75 mx-auto ">
        <form onSubmit={handleSubmit(onSubmitProject)}>
          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="form-label fw-light ">
              Title
            </label>
            <input
              type="text"
              placeholder="Name"
              className="form-control rounded-pill bg-light border-0 px-4 py-2"
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
              className="form-control rounded-4 bg-light border-0 px-4 py-2"
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
              onClick={() => navigate("/projects")}
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
