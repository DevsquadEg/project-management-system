import React, { useEffect, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import Task from "./Task";
import type { TaskType } from "@/interfaces/interfaces";
import { useMode } from "@/store/ModeContext/ModeContext";

interface ColumnProps {
  id: string;
  title: string;
  tasks: TaskType[];
  handleGoUp: (status: string, id: number) => void;
  handleGoDown: (status: string, id: number) => void;
}

const TaskColumn: React.FC<ColumnProps> = ({
  id,
  title,
  tasks,
  handleGoUp,
  handleGoDown,
}) => {
  const [tasksList, setTasksList] = useState<TaskType[]>([]);
  // console.log(title, "Column Tasks: ", tasks);
  const { setNodeRef } = useDroppable({
    id,
    data: {
      accepts: ["task"],
      columnId: id,
    },
  });
  const { darkMode } = useMode();

  useEffect(() => {
    setTasksList(tasks);
  }, [tasks]);
  return (
    <div
      ref={setNodeRef}
      className="col-md-4 position-relative styleTCEnhance"
      
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
            {tasksList?.map((task, index) => (
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
