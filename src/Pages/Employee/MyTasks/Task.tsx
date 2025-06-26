import React from "react";
import { useDraggable } from "@dnd-kit/core";
import type { TaskType } from "@/interfaces/interfaces";
import { useNavigate } from "react-router-dom";

interface TaskProps {
  task: TaskType;
  index: number;
  handleGoUp: (status: string, index: number) => void;
  handleGoDown: (status: string, index: number) => void;
  lastTask?: boolean;
}

const Task: React.FC<TaskProps> = ({
  task,
  index,
  handleGoUp,
  handleGoDown,
  lastTask = false,
}) => {
  const navigate = useNavigate();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: {
      type: "task",
      task,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 9999,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="card mb-2 mx-3 bg-main"
    >
      <div className="card-body position-relative">
        <div className="position-absolute top-0 end-0 ">
          {!lastTask && (
            <button
              className="btn btn-link p-2"
              onClick={(e) => {
                e.stopPropagation();
                // go down button action small arrow
                handleGoDown(task.status, index);
              }}
            >
              <i className="bi bi-arrow-down text-dark"></i>
            </button>
          )}

          {index !== 0 && (
            <button
              className="btn btn-link p-2"
              onClick={(e) => {
                e.stopPropagation();
                // go up button action
                handleGoUp(task.status, index);
              }}
            >
              <i className="bi bi-arrow-up text-dark"></i>
            </button>
          )}

          <button
            className="btn btn-link p-2"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/tasks/${task.id}`);
            }}
          >
            <i className="bi bi-eye text-success"></i>
          </button>
        </div>
        <div {...listeners}>
          <h6 className="card-title">{task.title}</h6>
          <p className="card-text small text-muted">{task.description}</p>
          <div className="position-absolute bottom-0 end-0 p-2">
            <span className="badge bg-secondary">
              {task.project?.title || "NoProject"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Task;
