import { useEffect, useState } from "react";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import TaskColumn from "./TaskColumn";
import type { Column, TasksState } from "@/interfaces/interfaces";
import { closestCorners } from "@dnd-kit/core";
import { useMode } from "@/store/ModeContext/ModeContext";
import { axiosInstance } from "@/service/urls";
import { TASK_URLS } from "@/service/api";
import toast from "react-hot-toast";
// import { arrayMove } from "./ArrayMove";

const initialData: TasksState = {
  data: [],
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
  const [state, setState] = useState<TasksState>(initialData);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useMode();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id as string;
    const overColumn = state.columns.find((column) => column.id === overId);
    if (!overColumn) return;
    if (
      overColumn.status ===
      state.data.find((task) => task.id === activeId)?.status
    )
      return;
    changeTaskStatus(activeId, overColumn?.status);

    setState((prev) => {
      // return prev;
      return {
        ...prev,
        data: [
          ...prev.data.map((task) => {
            if (task.id === activeId) {
              return {
                ...task,
                status: overColumn?.status,
              };
            }
            return task;
          }),
        ],
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
      setState((prev) => {
        return {
          ...prev,
          data: response.data.data,
        };
      });
    } catch (error) {
      console.error("Error fetching aligned tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      )) || (
        <div className="container-fluid mt-4">
          <DndContext
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
          >
            <div className="row">
              {state.columns
                .sort(
                  (a: Column, b: Column) =>
                    state.columnOrder.indexOf(a.id) -
                    state.columnOrder.indexOf(b.id)
                )
                .map((column) => {
                  return (
                    <TaskColumn
                      key={column.id}
                      id={column.id}
                      title={column.title}
                      tasks={state.data?.filter((task) => {
                        return task ? task.status === column.status : false;
                      })}
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
