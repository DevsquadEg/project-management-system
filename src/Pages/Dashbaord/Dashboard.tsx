import { useMode } from "@/store/ModeContext/ModeContext";
import Header from "../../components/Header/Header";
import { Helmet } from 'react-helmet-async';
import { useAuth } from "@/store/AuthContext/AuthContext";

export default function Dashboard() {
  const { darkMode } = useMode();
const {loginData} = useAuth()
  // Color definitions for consistent theming
  const themeColors = {
    primary: "#EF9B28",
    text: darkMode ? "#f8f9fa" : "#212529",
    mutedText: darkMode ? "#adb5bd" : "#6c757d",
    icon: darkMode ? "#EF9B28" : "#212529",
    cardBg: darkMode ? "#2c3034" : "#ffffff",
    statCard: {
      purple: darkMode ? "#3a2a4a" : "#e2d4f0",
      yellow: darkMode ? "#4a3a2a" : "#f0e4d4",
      pink: darkMode ? "#4a2a3a" : "#f0d4e4",
    },
  };

  return (
    <>

<Helmet>
  <title>{loginData?.userGroup == "Manager" ?"Home-Manager|Panel":"Home-Employee|Panel"}</title>
   <meta name="description" content="A modern project management system for organizing tasks, managing users, and tracking project progress effectively."
        />
</Helmet>



      <Header />
      <div
        className={`container mt-5 ${darkMode ? "text-light" : "text-dark"}`}
      >
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
                  Lorem ipsum dolor sit amet, consectetur
                </small>
              </div>

              <div className="d-flex gap-3 flex-wrap">
                <div
                  className="stat-card rounded-3 p-3"
                  style={{ backgroundColor: themeColors.statCard.purple }}
                >
                  <i
                    className="fa-solid fa-chart-line mb-2 fs-4"
                    style={{ color: themeColors.icon }} // Changed to use themeColors.icon
                  ></i>
                  <div className="fw-bold" style={{ color: themeColors.text }}>
                    Progress
                  </div>
                  <div style={{ color: themeColors.text }}>$ 7328.32</div>
                </div>

                <div
                  className="stat-card rounded-3 p-3"
                  style={{ backgroundColor: themeColors.statCard.yellow }}
                >
                  <i
                    className="fa-solid fa-tasks mb-2 fs-4"
                    style={{ color: themeColors.icon }} // Changed to use themeColors.icon
                  ></i>
                  <div className="fw-bold" style={{ color: themeColors.text }}>
                    Tasks Number
                  </div>
                  <div style={{ color: themeColors.text }}>1293</div>
                </div>

                <div
                  className="stat-card rounded-3 p-3"
                  style={{ backgroundColor: themeColors.statCard.pink }}
                >
                  <i
                    className="fa-solid fa-folder-open mb-2 fs-4"
                    style={{ color: themeColors.icon }} // Changed to use themeColors.icon
                  ></i>
                  <div className="fw-bold" style={{ color: themeColors.text }}>
                    Projects Number
                  </div>
                  <div style={{ color: themeColors.text }}>32</div>
                </div>
              </div>
            </div>
          </div>

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
                style={{ borderColor: themeColors.primary }}
              >
                <h6
                  className="mb-0 fw-bold"
                  style={{ color: themeColors.text }}
                >
                  Users
                </h6>
                <small style={{ color: themeColors.mutedText }}>
                  Lorem ipsum dolor sit amet, consectetur
                </small>
              </div>

              <div className="d-flex gap-3 flex-wrap">
                <div
                  className="stat-card rounded-3 p-3"
                  style={{ backgroundColor: themeColors.statCard.purple }}
                >
                  <i
                    className="fa-solid fa-user-check mb-2 fs-4"
                    style={{ color: themeColors.icon }} // Changed to use themeColors.icon
                  ></i>
                  <div className="fw-bold" style={{ color: themeColors.text }}>
                    Active
                  </div>
                  <div style={{ color: themeColors.text }}>$ 7328.32</div>
                </div>

                <div
                  className="stat-card rounded-3 p-3"
                  style={{ backgroundColor: themeColors.statCard.yellow }}
                >
                  <i
                    className="fa-solid fa-user-slash mb-2 fs-4"
                    style={{ color: themeColors.icon }} // Changed to use themeColors.icon
                  ></i>
                  <div className="fw-bold" style={{ color: themeColors.text }}>
                    Inactive
                  </div>
                  <div style={{ color: themeColors.text }}>1293</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
