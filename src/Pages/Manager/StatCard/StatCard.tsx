import React from "react";

interface StatCardProps {
  iconClass: string;
  label: string;
  value: string | number;
  backgroundColor: string;
  iconColor?: string;
  textColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  iconClass,
  label,
  value,
  backgroundColor,
  iconColor = "#212529",
  textColor = "#212529",
}) => {
  return (
    <div
      className="stat-card rounded-3 p-3"
      style={{
        backgroundColor,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
      }}
    >
      <i className={`${iconClass} mb-2 fs-4`} style={{ color: iconColor }}></i>
      <div className="fw-bold" style={{ color: textColor }}>
        {label}
      </div>
      <div style={{ color: textColor }}>{value}</div>
    </div>
  );
};

export default StatCard;
