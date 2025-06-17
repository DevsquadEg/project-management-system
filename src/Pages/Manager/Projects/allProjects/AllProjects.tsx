import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PROJECT_URLS } from "@/service/api";
import { axiosInstance } from "@/service/urls";
import { isAxiosError } from "axios";

export default function AllProjects() {
  const [allProjects, setAllProjects] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");

  //=======  get all projects ==============
  const getAllProjects = async (title = "") => {
    try {
      const response = await axiosInstance.get(
        PROJECT_URLS.GET_PROJECTS_BY_MANAGER,
        {
          params: {
            title: title,
            pageNumber: 1,
            pageSize: 10,
          },
        }
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
    getAllProjects(searchTitle);
  }, [searchTitle]);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center px-5 py-4 mb-4 bg-white border border-start-0">
        <h2>Projects</h2>
        <div>
          <button className="btn btn-lg bg-orange rounded-pill text-white px-5">
            add new project
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
        <div className="d-flex justify-content-end align-items-center p-3    gap-5">
          <div className="d-flex align-items-center gap-2">
            <span>Showing</span>
            <select
              className="form-select border rounded-pill px-3 py-1"
              style={{ width: "80px" }}
            >
              <option value="10">5</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span>of {allProjects.length} Results</span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <span>Page 1 of 10</span>
            <div className="d-flex gap-3">
              <button className="btn btn-white border-0 p-1">
                <i className="bi bi-chevron-left fs-5 text-secondary"></i>
              </button>
              <button className="btn btn-white border-0 p-1">
                <i className="bi bi-chevron-right fs-5 text-secondary"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
