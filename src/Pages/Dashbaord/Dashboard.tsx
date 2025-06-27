import { useMode } from "@/store/ModeContext/ModeContext";
import type { AgChartOptions } from "ag-charts-community";
import Header from "../../components/Header/Header";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/store/AuthContext/AuthContext";

import { useEffect, useMemo, useState } from "react";
import { AgCharts } from "ag-charts-react";
import { axiosInstance } from "@/service/urls";
import { PROJECT_URLS, TASK_URLS, USERS_URL } from "@/service/api";
import toast from "react-hot-toast";
import StatCard from "../Manager/StatCard/StatCard";
import { getThemeColors } from "../../service/style";

export default function Dashboard() {
  const { darkMode } = useMode();
  const themeColors = getThemeColors(darkMode);
  const { loginData } = useAuth();
  const isManger = loginData?.userGroup === "Manager";

  // Color definitions for consistent theming

  // State to hold user list and pagination details
  const [userList, setUserList] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [allTasks, setAllTasks] = useState([]);

  const activeCount = userList.filter((u: any) => u.isActivated).length;
  const notActiveCount = userList.filter((u: any) => !u.isActivated).length;

  //=======  get all tasks ==============
  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get(TASK_URLS.GET_TASKS_BY_MANAGER, {
        params: {
          pageSize: 1000, // Set to a high number to get all tasks
          pageNumber: 1, // Start from the first page
        },
      });
      setAllTasks(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
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
    } catch (error: any) {
      if (error) {
        toast.error(error?.response?.data.message || "Something went wrong!");
      }
    }
  };

  // const tasks = [
  //   { status: "To Do" },
  //   { status: "In Progress" },
  //   { status: "Done" },
  //   { status: "To Do" },
  //   { status: "Done" },
  // ];

  // Fetch users when the component mounts
  const usersChartOptions = useMemo<AgChartOptions>(() => {
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
  const tasksChartOptions = useMemo<AgChartOptions>(() => {
    const toDoTaks = allTasks.filter((t: any) => t.status === "ToDo").length;
    const InProgress = allTasks.filter(
      (t: any) => t.status === "InProgress"
    ).length;
    const doneTasks = allTasks.filter((t: any) => t.status === "Done").length;

    return {
      title: { text: ` Tasks` },
      data: [
        {
          status: "To Do",
          count: toDoTaks,
        },
        {
          status: "In Progress",
          count: InProgress,
        },
        {
          status: "Done",
          count: doneTasks,
        },
      ],
      series: [
        {
          type: "donut",
          angleKey: "count",
          calloutLabelKey: "status",
          innerRadiusRatio: 0.9,
          innerLabels: [
            {
              text: "Total",
              fontWeight: "bold",
              fontSize: 14,
            },
            {
              text: `${allTasks.length}`,
              fontSize: 32,
              color: "black",
              spacing: 4,
            },
          ],
          innerCircle: {
            fill: ` ${darkMode ? "#0e1627" : "#f5f5f5"}`,
          },
        },
      ],
    };
  }, [allTasks]);

  useEffect(() => {
    getAllUsers();
    getAllProjects();
    getAllTasks();
  }, []);

  return (
    <>
      <Helmet>
        <title>
          {loginData?.userGroup == "Manager"
            ? "Home-Manager|Panel"
            : "Home-Employee|Panel"}
        </title>
        <meta
          name="description"
          content="A modern project management system for organizing tasks, managing users, and tracking project progress effectively."
        />
      </Helmet>

      <Header />
      <div className={`mx-4  mt-4 ${darkMode ? "text-light" : "text-dark"}`}>
        <div className="row gy-4">
          {/* Tasks Section */}
          <div className="col-md-6">
            <div
              className={`${
                darkMode ? "bg-dark" : "bg-white"
              } p-4 rounded-4 shadow-sm`}
              style={{ backgroundColor: themeColors.cardBg }}
            >
              <div
                className="border-start border-4 ps-3 mb-3"
                style={{ borderColor: themeColors.primary }}
              >
                <h6
                  className="mb-0 fw-bold"
                  style={{ color: themeColors.text }}
                >
                  Tasks
                </h6>
                <small style={{ color: themeColors.mutedText }}>
                  tasks are the backbone of any project, ensuring that work is
                  organized and tracked efficiently.
                </small>
              </div>

              {/* Stat Cards for Tasks */}
              <div className="d-flex gap-3 flex-wrap">
                <StatCard
                  iconClass="fa-solid fa-tasks"
                  label="Total Tasks"
                  value={allTasks.length}
                  backgroundGradient={themeColors.statCard.blue}
                  iconColor={themeColors.icon}
                  textColor={themeColors.text}
                />

                <StatCard
                  iconClass="fa-solid fa-spinner"
                  label="In Progress"
                  value={
                    allTasks.filter((t) => t.status === "InProgress").length
                  }
                  backgroundGradient={themeColors.statCard.orange}
                  iconColor={themeColors.icon}
                  textColor={themeColors.text}
                />

                <StatCard
                  iconClass="fa-solid fa-check"
                  label="Completed"
                  value={
                    allTasks.filter((t: any) => t.status === "Done").length
                  }
                  backgroundGradient={themeColors.statCard.green}
                  iconColor={themeColors.icon}
                  textColor={themeColors.text}
                />
              </div>
            </div>
          </div>

          {isManger && (
            <>
              {/* Users Section */}
              <div className="col-md-6">
                <div
                  className={`${
                    darkMode ? "bg-dark" : "bg-white"
                  } p-4 rounded-4 shadow-sm`}
                  style={{ backgroundColor: themeColors.cardBg }}
                >
                  <div
                    className="border-start border-4 ps-3 mb-3"
                    style={{ borderLeft: `${themeColors.primary} !important` }}
                  >
                    <h6
                      className="mb-0 fw-bold"
                      style={{ color: themeColors.text }}
                    >
                      Users
                    </h6>
                    <small style={{ color: themeColors.mutedText }}>
                      users are the key to any project, bringing skills and
                      expertise to
                    </small>
                  </div>

                  {/*  Stat Cards for Users */}
                  <div className="d-flex gap-3 flex-wrap">
                    <StatCard
                      iconClass="fa-solid fa-users"
                      label="Total "
                      value={userList.length}
                      backgroundGradient={themeColors.statCard.violet} // بنفسجي
                      iconColor={themeColors.icon}
                      textColor={themeColors.text}
                    />

                    <StatCard
                      iconClass="fa-solid fa-user-plus"
                      label="Active "
                      value={activeCount}
                      backgroundGradient={themeColors.statCard.green} // أخضر
                      iconColor={themeColors.icon}
                      textColor={themeColors.text}
                    />

                    <StatCard
                      iconClass="fa-solid fa-user-slash"
                      label="Inactive "
                      value={notActiveCount}
                      backgroundGradient={themeColors.statCard.red} // أحمر
                      iconColor={themeColors.icon}
                      textColor={themeColors.text}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          {/* Chart Section */}
          <div className="container mt-5">
            <div className="row gy-4">
              {isManger && (
                <>
                  <div className="col-md-4 ">
                    <AgCharts className="" options={usersChartOptions} />
                  </div>

                  <div className="col-md-8">
                    <AgCharts options={projectTrendChartOptions} />
                  </div>
                </>
              )}
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
