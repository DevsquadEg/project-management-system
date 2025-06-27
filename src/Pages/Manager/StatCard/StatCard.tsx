import React from "react";

interface StatCardProps {
  iconClass: string;
  label: string;
  value: string | number;
  backgroundGradient: string;
  iconColor?: string;
  textColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  iconClass,
  label,
  value,
  backgroundGradient,
  iconColor = "#212529",
  textColor = "#212529",
}) => {
  return (
    <div
      className="rounded-3 p-3"
      style={{
        background: backgroundGradient,
        color: textColor,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s ease",
        flex: "1",
        minWidth: "140px",
        textAlign: "center",
        borderRadius: "1rem",
        padding: "1rem",
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
