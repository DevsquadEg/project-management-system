import type { AgChartOptions } from "ag-charts-community";
import Header from "../../components/Header/Header";

import { useEffect, useMemo, useState } from "react";
import { AgCharts } from "ag-charts-react";
import { axiosInstance } from "@/service/urls";
import { PROJECT_URLS, TASK_URLS, USERS_URL } from "@/service/api";
import toast from "react-hot-toast";

export default function Dashboard() {
  // State to hold user list and pagination details
  const [userList, setUserList] = useState([]);

  const [allProjects, setAllProjects] = useState([]);

  //=======  get all tasks ==============
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
        {}
      );
      console.log(response);
      console.log(response.data.totalNumberOfRecords);
      setAllTasks(response.data.data);
      setTotalPages(response.data.totalNumberOfPages);
      setTotalNumberOfRecords(response.data.totalNumberOfRecords);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error?.response?.data.message || "Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  // get users list
  const getAllUsers = async () => {
    try {
      let response: any = await axiosInstance.get(USERS_URL.GET_ALL_USERS, {
        params: {
          pageSize: 1000, // Set to a high number to get all users
          pageNumber: 1, // Start from the first page
        },
      });

      // console.log(response.data);
      setUserList(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  //=======  get all projects ==============
  const getAllProjects = async () => {
    try {
      const response = await axiosInstance.get(PROJECT_URLS.GET_ALL_PROJECTS, {
        params: {
          pageSize: 1000, // Set to a high number to get all projects
          pageNumber: 1, // Start from the first page
        },
      });
      // Set to a high number to get all projects
      const data = response.data.data;
      setAllProjects(data);
      console.log(data);
    } catch (error) {
      if (error) {
        toast.error(error?.response?.data.message || "Something went wrong!");
      }
    }
  };

  const tasks = [
    { status: "To Do" },
    { status: "In Progress" },
    { status: "Done" },
    { status: "To Do" },
    { status: "Done" },
  ];

  // Fetch users when the component mounts
  const usersChartOptions = useMemo<AgChartOptions>(() => {
    const activeCount = userList.filter((u) => u.isActivated).length;
    const notActiveCount = userList.filter((u) => !u.isActivated).length;

    return {
      title: { text: `Users ` },
      data: [
        {
          label: `Active `,
          value: activeCount,
        },
        {
          label: `Not Active `,
          value: notActiveCount,
        },
      ],
      series: [
        {
          type: "donut",
          angleKey: "value",
          calloutLabelKey: "label",
          innerRadiusRatio: 0.9,
          innerLabels: [
            {
              text: "Total",
              fontWeight: "bold",
              fontSize: 14,
            },
            {
              text: `${userList.length}`,
              fontSize: 32,
              color: "black",
              spacing: 4,
            },
          ],
          innerCircle: {
            fill: "#e6ffe6", // خلفية وسط الدائرة
          },
          fills: ["#4CAF50", "#E57373"],
        },
      ],
      background: {
        fill: "white",
        stroke: "#ccc",
        strokeWidth: 1,
      },
    };
  }, [userList]);

  // Projects chart options
  // Using useMemo to avoid unnecessary recalculations
  const projectTrendChartOptions = useMemo<AgChartOptions>(() => {
    if (!Array.isArray(allProjects)) return { data: [], series: [] };

    const monthlyStats: Record<string, { created: number; modified: number }> =
      {};

    allProjects.forEach((project: any) => {
      const createdMonth = project.creationDate?.substring(0, 7); // "YYYY-MM"
      const modifiedMonth = project.modificationDate?.substring(0, 7);

      if (createdMonth) {
        if (!monthlyStats[createdMonth])
          monthlyStats[createdMonth] = { created: 0, modified: 0 };
        monthlyStats[createdMonth].created++;
      }

      if (modifiedMonth) {
        if (!monthlyStats[modifiedMonth])
          monthlyStats[modifiedMonth] = { created: 0, modified: 0 };
        monthlyStats[modifiedMonth].modified++;
      }
    });

    const chartData = Object.entries(monthlyStats)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([month, { created, modified }]) => ({
        month, // format: "2025-06"
        created,
        modified,
      }));

    return {
      title: { text: "Projects by Months" },
      data: chartData,
      series: [
        {
          type: "line",
          xKey: "month",
          yKey: "created",
          yName: "Created",
          stroke: "#4CAF50",
          fillOpacity: 0.9,
        },
        {
          type: "line",
          xKey: "month",
          yKey: "modified",
          yName: "Modified",
          stroke: "#FFA726",
          fillOpacity: 0.9,
        },
      ],
      axes: [
        {
          type: "category",
          position: "bottom",
          title: { text: "Month" },
          label: {
            // rotation: 45,
            formatter: ({ value }) =>
              new Date(value + "-01").toLocaleDateString("en-EG", {
                month: "short",
                year: "2-digit",
              }),
          },
        },
        {
          type: "number",
          position: "left",
          title: { text: "Projects Count" },
          min: 0,
        },
      ],

      legend: {
        position: "bottom",
      },
      background: {
        rounded: true,
        // fill: "#f5f5f5", // خلفية فاتحة
        // fill: "#0e1627", // نفس خلفية الداكنة
      },
    };
  }, [allProjects]);

  // Tasks chart options
  const [tasksChartOptions] = useState<AgChartOptions>({
    title: { text: "Tasks by Status" },
    data: [
      {
        status: "To Do",
        count: tasks.filter((t) => t.status === "To Do").length,
      },
      {
        status: "In Progress",
        count: tasks.filter((t) => t.status === "In Progress").length,
      },
      {
        status: "Done",
        count: tasks.filter((t) => t.status === "Done").length,
      },
    ],
    series: [
      {
        type: "donut",
        angleKey: "count",
        calloutLabelKey: "status",
        innerRadiusRatio: 0.9,
      },
    ],
  });

  useEffect(() => {
    getAllUsers();
    getAllProjects();
  }, []);

  return (
    <>
      <Header />
      <div className="container mt-5 ">
        <div className="row gy-4">
          {/* Tasks Section */}
          <div className="col-md-6">
            <div className="bg-white p-4 rounded-4 shadow-sm">
              <div
                className="border-start border-4 ps-3 mb-3"
                style={{ borderColor: "#EF9B28" }}
              >
                <h6 className="mb-0 fw-bold">Tasks</h6>
                <small className="text-muted">
                  Lorem ipsum dolor sit amet, consectetur
                </small>
              </div>

              <div className="d-flex gap-3 flex-wrap">
                <div className="stat-card bg-light-purple">
                  <i className="fa-solid fa-chart-line mb-2 fs-4 text-dark"></i>
                  <div className="fw-bold">Progress</div>
                  <div>$ 7328.32</div>
                </div>
                <div className="stat-card bg-light-yellow">
                  <i className="fa-solid fa-tasks mb-2 fs-4 text-dark"></i>
                  <div className="fw-bold">Tasks Number</div>
                  <div>1293</div>
                </div>
                <div className="stat-card bg-light-pink">
                  <i className="fa-solid fa-folder-open mb-2 fs-4 text-dark"></i>
                  <div className="fw-bold">Projects Number</div>
                  <div>32</div>
                </div>
              </div>
            </div>
          </div>

          {/* Users Section */}
          <div className="col-md-6">
            <div className="bg-white p-4 rounded-4 shadow-sm">
              <div
                className="border-start border-4 ps-3 mb-3"
                style={{ borderColor: "#EF9B28" }}
              >
                <h6 className="mb-0 fw-bold">Users</h6>
                <small className="text-muted">
                  Lorem ipsum dolor sit amet, consectetur
                </small>
              </div>

              <div className="d-flex gap-3 flex-wrap">
                <div className="stat-card bg-light-purple">
                  <i className="fa-solid fa-user-check mb-2 fs-4 text-dark"></i>
                  <div className="fw-bold">Active</div>
                  <div>$ 7328.32</div>
                </div>
                <div className="stat-card bg-light-yellow">
                  <i className="fa-solid fa-user-slash mb-2 fs-4 text-dark"></i>
                  <div className="fw-bold">Inactive</div>
                  <div>1293</div>
                </div>
              </div>
            </div>
          </div>
          {/* Chart Section */}
          <div className="container mt-5">
            <div className="row gy-4">
              <div className="col-md-4 ">
                <AgCharts className="" options={usersChartOptions} />
              </div>
              <div className="col-md-8">
                <AgCharts options={projectTrendChartOptions} />
              </div>
              <div className="col-md-4">
                <AgCharts options={tasksChartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
