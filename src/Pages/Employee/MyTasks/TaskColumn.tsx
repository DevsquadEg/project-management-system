import React, { useEffect, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import Task from "./Task";
import type { TaskType } from "@/interfaces/interfaces";
import { useMode } from "@/store/ModeContext/ModeContext";
import { arrayMove } from "@dnd-kit/sortable";

interface ColumnProps {
  id: string;
  title: string;
  tasks: TaskType[];
}

const TaskColumn: React.FC<ColumnProps> = ({ id, title, tasks }) => {
  const [tasksList, setTasksList] = useState<TaskType[]>([]);
  const { setNodeRef } = useDroppable({
    id,
    data: {
      accepts: ["task"],
      columnId: id,
    },
  });
  const { darkMode } = useMode();
  const handleGoUp = (index: number) => {
    if (index === 0) return;
    setTasksList(arrayMove(tasksList, index, index - 1));
  };

  const handleGoDown = (index: number) => {
    if (index === tasksList.length - 1) return;
    setTasksList(arrayMove(tasksList, index, index + 1));
  };

  useEffect(() => {
    setTasksList(tasks);
  }, [tasks]);
  return (
    <div
      ref={setNodeRef}
      className="col-md-4 position-relative"
      style={{
        minHeight: "400px",
      }}
    >
      <h5 className="mb-4 ms-4">{title}</h5>
      <div
        className="card h-100"
        style={{
          backgroundColor: darkMode ? "#2d3748" : "#315951E5",
        }}
      >
        <div className="card-body position-relative p-0 pt-3">
          <div className="position-relative">
            {tasksList.map((task, index) => (
              <Task
                task={task}
                index={index}
                key={task.id}
                handleGoUp={handleGoUp}
                handleGoDown={handleGoDown}
                lastTask={index === tasksList.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskColumn;
