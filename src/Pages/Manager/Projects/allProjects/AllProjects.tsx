import { useEffect, useState } from "react";
import Header from "../../../../components/Header/Header";
import toast from "react-hot-toast";
import { PROJECT_URLS } from "@/service/api";
import { axiosInstance } from "@/service/urls";

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
      const status = error.response?.status;
      if (status !== 403 || allProjects.length > 0) {
        toast.error("Failed to load all Projects");
      }
    }
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  return (
    <>
      <Header />
      <div>
        <table className="table table-striped table-hover table-bordered align-middle text-center">
          <thead
            className="table table-success table-custom"
            // style={{ background: "rgba(49, 89, 81, 0.90)" }}
          >
            <tr>
              <th className="">
                <span className=" fw-lighter">Title</span>
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
              <th className="">Actions</th>
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
                  <button className="btn btn-sm btn-light">
                    <i className="bi bi-three-dots-vertical"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
