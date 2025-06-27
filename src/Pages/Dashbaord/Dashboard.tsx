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
import {
  FaCheck,
  FaSpinner,
  FaTasks,
  FaUserPlus,
  FaUsers,
  FaUserSlash,
} from "react-icons/fa";

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
    const url = isManger
      ? TASK_URLS.GET_TASKS_BY_MANAGER
      : TASK_URLS.GET_ASSIGNED_TASKS;
    try {
      const response = await axiosInstance.get(url, {
        params: {
          pageSize: 1000, // Set to a high number to get all tasks
          pageNumber: 1, // Start from the first page
        },
      });
      setAllTasks(response.data.data);
      // console.log(response.data.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
  };

  // ====== get users list =====
  const getAllUsers = async () => {
    if (!isManger) return; // Only managers can access this data
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
      // console.log(error);
    }
  };

  //=======  get all projects ==============
  const getAllProjects = async () => {
    const url = isManger
      ? PROJECT_URLS.GET_ALL_PROJECTS
      : PROJECT_URLS.GET_PROJECTS_BY_EMPLOYEE;
    try {
      const response = await axiosInstance.get(url, {
        params: {
          pageSize: 1000, // Set to a high number to get all projects
          pageNumber: 1, // Start from the first page
        },
      });
      // Set to a high number to get all projects
      const data = response.data.data;
      setAllProjects(data);
      // console.log(data);
    } catch (error: any) {
      if (error) {
        toast.error(error?.response?.data.message || "Something went wrong!");
      }
    }
  };

  // Fetch users when the component mounts
  const usersChartOptions = useMemo<AgChartOptions>(() => {
    const textColor = darkMode ? "#ffffff" : "#212529";
    const bgColor = darkMode ? "#0e1627" : "#ffffff";
    const circleBg = darkMode ? "#1c1f24" : "#e6ffe6";

    return {
      title: {
        text: "Users",
        color: textColor,
      },
      data: [
        {
          label: "Active",
          value: activeCount,
        },
        {
          label: "Not Active",
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
              color: textColor,
            },
            {
              text: `${userList.length}`,
              fontSize: 32,
              color: textColor,
              spacing: 4,
            },
          ],
          innerCircle: {
            fill: circleBg,
          },
          fills: ["#4CAF50", "#E57373"],
          strokes: [bgColor],
        },
      ],
      background: {
        fill: bgColor,
        stroke: darkMode ? "#0e1627" : "#ccc",
        strokeWidth: 1,
      },
      legend: {
        position: "bottom",
        item: {
          label: {
            color: textColor,
          },
        },
      },
    };
  }, [userList, darkMode]);

  // Projects trend chart options for manager

  const projectTrendChartOptions = useMemo<AgChartOptions>(() => {
    if (!Array.isArray(allProjects)) return { data: [], series: [] };

    const monthlyStats: Record<string, { created: number; modified: number }> =
      {};

    allProjects.forEach((project: any) => {
      const createdDate = project.creationDate
        ? new Date(project.creationDate)
        : null;
      const modifiedDate = project.modificationDate
        ? new Date(project.modificationDate)
        : null;

      const createdMonth = createdDate
        ? createdDate.toISOString().slice(0, 7)
        : null;
      const modifiedMonth = modifiedDate
        ? modifiedDate.toISOString().slice(0, 7)
        : null;

      if (createdMonth) {
        if (!monthlyStats[createdMonth]) {
          monthlyStats[createdMonth] = { created: 0, modified: 0 };
        }
        monthlyStats[createdMonth].created++;
      }

      if (modifiedMonth) {
        if (!monthlyStats[modifiedMonth]) {
          monthlyStats[modifiedMonth] = { created: 0, modified: 0 };
        }
        monthlyStats[modifiedMonth].modified++;
      }
    });

    const chartData = Object.entries(monthlyStats)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([month, { created, modified }]) => ({
        month,
        created,
        modified,
      }));

    return {
      title: {
        text: "Projects by Months",
        fontSize: 16,
        color: darkMode ? "#f8f9fa" : "#212529",
      },
      data: chartData,
      series: [
        {
          type: "line",
          xKey: "month",
          yKey: "created",
          yName: "Created",
          stroke: "#4CAF50",
          marker: { shape: "circle" },
        },
        {
          type: "line",
          xKey: "month",
          yKey: "modified",
          yName: "Modified",
          stroke: "#FFA726",
          marker: { shape: "square" },
        },
      ],
      axes: [
        {
          type: "category",
          position: "bottom",
          title: { text: "Month" },
          label: {
            color: darkMode ? "#f8f9fa" : "#212529",
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
          title: { text: "Projects Count", color: themeColors.text },
          min: 0,
          label: {
            color: darkMode ? "#f8f9fa" : "#212529",
          },
        },
      ],
      legend: {
        position: "bottom",
        item: {
          label: {
            color: darkMode ? "#f8f9fa" : "#212529",
          },
        },
      },
      background: {
        fill: darkMode ? "#0e1627" : "#fff",
        stroke: darkMode ? "#0e1627" : "#ccc",
        strokeWidth: 1,
      },
    };
  }, [allProjects, darkMode]);

  // Projects count for empolo chart options
  const totalProjectsChartOptions = useMemo<AgChartOptions>(() => {
    return {
      title: {
        text: "Total Projects",
        color: themeColors.text,
      },
      data: [
        {
          label: "Projects",
          count: allProjects.length,
        },
      ],
      series: [
        {
          type: "bar",
          xKey: "label",
          yKey: "count",
          yName: "Projects",
          fill: "#EF9B28",
          stroke: "#EF9B28",
          fillOpacity: 0.85,
        },
      ],
      axes: [
        {
          type: "category",
          position: "bottom",
        },
        {
          type: "number",
          position: "left",
          title: { text: "Count", color: themeColors.text },
          min: 0,
        },
      ],
      background: {
        fill: darkMode ? "#0e1627" : "#fff",
      },
      legend: {
        enabled: false,
      },
    };
  }, [allProjects, darkMode]);

  // Tasks chart options
  const tasksChartOptions = useMemo<AgChartOptions>(() => {
    const toDoTaks = allTasks.filter((t: any) => t.status === "ToDo").length;
    const InProgress = allTasks.filter(
      (t: any) => t.status === "InProgress"
    ).length;
    const doneTasks = allTasks.filter((t: any) => t.status === "Done").length;

    const textColor = darkMode ? "#ffffff" : "#212529";

    return {
      title: {
        text: "Tasks",
        color: textColor,
      },
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
              color: textColor, // ← لون النص داخل الدائرة
            },
            {
              text: `${allTasks.length}`,
              fontSize: 32,
              color: textColor, // ← لون العدد داخل الدائرة
              spacing: 4,
            },
          ],
          innerCircle: {
            fill: darkMode ? "#0e1627" : "#f5f5f5",
          },
          fills: ["#42A5F5", "#FFB74D", "#66BB6A"], // ألوان واضحة للقطاعات
          strokes: [darkMode ? "#0e1627" : "#ffffff"],
        },
      ],
      background: {
        fill: darkMode ? "#0e1627" : "#fff",
      },
      legend: {
        position: "bottom",
        item: {
          label: {
            color: textColor,
          },
        },
      },
    };
  }, [allTasks, darkMode]);

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
                  icon={<FaTasks />}
                  label="Total Tasks"
                  value={allTasks.length}
                  backgroundGradient={themeColors.statCard.blue}
                  iconColor={themeColors.icon}
                  textColor={themeColors.text}
                />

                <StatCard
                  icon={<FaSpinner />}
                  label="In Progress"
                  value={
                    allTasks.filter((t: any) => t.status === "InProgress")
                      .length
                  }
                  backgroundGradient={themeColors.statCard.orange}
                  iconColor={themeColors.icon}
                  textColor={themeColors.text}
                />

                <StatCard
                  icon={<FaCheck />}
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
                      icon={<FaUsers />}
                      label="Total "
                      value={userList.length}
                      backgroundGradient={themeColors.statCard.violet}
                      iconColor={themeColors.icon}
                      textColor={themeColors.text}
                    />

                    <StatCard
                      icon={<FaUserPlus />}
                      label="Active "
                      value={activeCount}
                      backgroundGradient={themeColors.statCard.green}
                      iconColor={themeColors.icon}
                      textColor={themeColors.text}
                    />

                    <StatCard
                      icon={<FaUserSlash />}
                      label="Inactive "
                      value={notActiveCount}
                      backgroundGradient={themeColors.statCard.red}
                      iconColor={themeColors.icon}
                      textColor={themeColors.text}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          {/* Users Chart - Manager only */}
          {isManger && (
            <div className="col-md-3">
              <div className="p-1 shadow-sm rounded-3 bg-white">
                <AgCharts options={usersChartOptions} />
              </div>
            </div>
          )}

          {/* Tasks Chart - visible to all */}
          <div className="col-md-3">
            <div className="p-1 shadow-sm rounded-3 bg-white">
              <AgCharts options={tasksChartOptions} />
            </div>
          </div>

          {/* Projects Chart - dynamic based on role */}
          <div className={isManger ? "col-md-6" : "col-md-3"}>
            <div className="p-1 shadow-sm rounded-3 bg-white">
              <AgCharts
                options={
                  isManger
                    ? projectTrendChartOptions
                    : totalProjectsChartOptions
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
