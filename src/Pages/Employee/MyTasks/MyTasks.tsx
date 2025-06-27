import { use, useEffect, useState } from "react";
import { closestCorners, DndContext, type DragEndEvent } from "@dnd-kit/core";
import TaskColumn from "./TaskColumn";
import type { Column, TasksState, TaskType } from "@/interfaces/interfaces";
import { useMode } from "@/store/ModeContext/ModeContext";
import { axiosInstance } from "@/service/urls";
import { TASK_URLS } from "@/service/api";
import toast from "react-hot-toast";
import { arrayMove } from "@dnd-kit/sortable";
import { useAuth } from "@/store/AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";

const initialData: TasksState = {
  data: { ToDo: [], InProgress: [], Done: [] },
  dataLength: 0,
  columns: [
    {
      id: "column-1",
      title: "To Do",
      status: "ToDo",
    },
    {
      id: "column-2",
      title: "In Progress",
      status: "InProgress",
    },
    {
      id: "column-3",
      title: "Done",
      status: "Done",
    },
  ],
  columnOrder: ["column-1", "column-2", "column-3"],
};

export default function MyTasks() {
  const navigat = useNavigate();
  const { loginData } = useAuth();
  const [data, setData] = useState<TasksState>(initialData);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useMode();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;
    const activeId = active.id as number;
    const activeTask = active.data.current?.task;
    const activeColumnStatus = activeTask.status;
    const overId = over.id as string;
    const overColumn = data.columns.find((column) => column.id === overId);
    if (!overColumn) return;
    console.log("I am here");
    console.log("overColumn", overColumn);
    console.log("overColumn", data.data[overColumn.status]);
    if (data.data[overColumn.status].includes(activeTask as TaskType)) return;
    changeTaskStatus(activeId, overColumn?.status);

    setData((prev) => {
      console.log("active", active);
      // return prev;
      const targetTask = prev.data[activeTask.status].filter(
        (task: TaskType) => task.id === activeId
      )[0];
      if (!targetTask) return prev;
      console.log("target", targetTask);
      targetTask.status = overColumn.status;
      console.log("target2", targetTask);
      console.log("active2", active);
      return {
        ...prev,
        data: {
          ...prev.data,
          [activeColumnStatus]: prev.data[activeColumnStatus].filter(
            (task: TaskType) => task.id !== activeTask.id
          ),
          [overColumn.status]: [...prev.data[overColumn.status], targetTask],
        },
      };
    });
  };

  const handleGoUp = (status: string, index: number) => {
    if (index === 0) return;
    const newList = arrayMove(data.data[status], index, index - 1);
    setData((prev: TasksState) => {
      return {
        ...prev,
        data: {
          ...prev.data,
          [status]: newList,
        },
      };
    });
  };

  const handleGoDown = (status: string, index: number) => {
    if (index === data.data[status].length - 1) return;
    const newList = arrayMove(data.data[status], index, index + 1);
    setData((prev: TasksState) => {
      return {
        ...prev,
        data: {
          ...prev.data,
          [status]: newList,
        },
      };
    });
  };

  const changeTaskStatus = async (id: number, status: string) => {
    try {
      await axiosInstance
        .put(TASK_URLS.CHANGE_STATUS(id), {
          status,
        })
        .then(() => {
          toast.success("Status Changed Successfully");
        });
    } catch (error: unknown) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      fetchAssignedTasks();
    }
  };

  const fetchAssignedTasks = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(TASK_URLS.GET_ASSIGNED_TASKS, {
        params: {
          pageSize: 100,
          pageNumber: 1,
        },
      });
      setData((prev) => {
        return {
          ...prev,
          dataLength: response.data.data.length,
          data: {
            ToDo: response.data.data.filter(
              (task: TaskType) => task.status === "ToDo"
            ),
            InProgress: response.data.data.filter(
              (task: TaskType) => task.status === "InProgress"
            ),
            Done: response.data.data.filter(
              (task: TaskType) => task.status === "Done"
            ),
          },
        };
      });
    } catch (error) {
      console.error("Error fetching aligned tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loginData?.userGroup === "Manager") {
      navigat("/login");
      return;
    }
    fetchAssignedTasks();
  }, []);

  return (
    <>
      <div
        className={`d-flex justify-content-between align-items-center px-5 py-4 mb-4 ${
          darkMode ? "bg-dark" : "bg-white"
        } border border-start-0`}
      >
        <h2>My Tasks</h2>
      </div>
      {(loading && (
        <div className="my-5 mx-auto w-100 d-flex justify-content-center">
          <i className="fa fa-spinner fa-spin fa-5x mx-auto"></i>
        </div>
      )) ||
        (data.dataLength === 0 && (
          <div className="my-5 mx-auto w-100 d-flex justify-content-center">
            <h3 className="text-muted">No Tasks Found</h3>
          </div>
        )) || (
          <div className="container-fluid mt-4">
            <DndContext
              collisionDetection={closestCorners}
              onDragEnd={handleDragEnd}
            >
              <div className="row">
                {data.columns
                  .sort(
                    (a: Column, b: Column) =>
                      data.columnOrder.indexOf(a.id) -
                      data.columnOrder.indexOf(b.id)
                  )
                  .map((column) => {
                    return (
                      <TaskColumn
                        key={column.id}
                        id={column.id}
                        title={column.title}
                        tasks={data.data[column.status]}
                        handleGoUp={handleGoUp}
                        handleGoDown={handleGoDown}
                      />
                    );
                  })}
              </div>
            </DndContext>
          </div>
        )}
    </>
  );
}
