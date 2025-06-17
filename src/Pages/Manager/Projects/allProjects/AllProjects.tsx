import { useEffect, useState } from "react";
import Header from "../../../../components/Header/Header";
import toast from "react-hot-toast";
import { PROJECT_URLS } from "@/service/api";
import { axiosInstance } from "@/service/urls";
import { isAxiosError } from "axios";

export default function AllProjects() {
  const [allProjects, setAllProjects] = useState([]);

  //=======  get all projects ==============
  const getAllProjects = async () => {
    try {
      const response = await axiosInstance.get(
        PROJECT_URLS.GET_PROJECTS_BY_MANAGER
      );
      console.log(response.data.data);
      setAllProjects(response.data.data);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data.message || "Something went wrong!");
      }
    }
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  return (
    <>
      <Header title={"All Projects"} />
      <div className="">
        <div className="d-flex justify-content-between align-items-center py-3">
          <div className="input-group mb-3 w-25 ">
            <span className="input-group-text " id="basic-addon1">
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
          <div>
            <button className="btn btn-lg btn-warning rounded-pill text-white px-5">
              add new project
            </button>
          </div>
        </div>
        <table className="table table-striped table-hover table-bordered align-middle text-center ">
          <thead
            className="table table-success table-custom"
            style={{ background: "rgba(49, 89, 81, 0.90)" }}
          >
            <tr>
              <th className="">
                <span>Title</span>
                <i className="bi bi-chevron-expand ms-1 "></i>
              </th>
              <th className="">
                <span>Description</span>
                <i className="bi bi-chevron-expand ms-1 "></i>
              </th>

              <th className="">
                <span>Num Tasks</span>
                <i className="bi bi-chevron-expand ms-1 "></i>
              </th>
              <th className="">
                <span>Date Created</span>
                <i className="bi bi-chevron-expand ms-1 "></i>
              </th>
              <th className="">
                <span>Actions</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {allProjects.map((project: any) => (
              <tr key={project.id}>
                <td>{project.title}</td>
                <td>{project.description}</td>
                <td>{project.task.length}</td>
                <td>{new Date(project.creationDate).toLocaleDateString()}</td>
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
                        <button className="dropdown-item d-flex align-items-center gap-2 text-success">
                          <i className="bi bi-eye"></i> View
                        </button>
                      </li>

                      <li>
                        <button className="dropdown-item d-flex align-items-center gap-2 text-success">
                          <i className="bi bi-pencil-square"></i> Edit
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item d-flex align-items-center gap-2 text-danger">
                          <i className="bi bi-trash"></i> Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
