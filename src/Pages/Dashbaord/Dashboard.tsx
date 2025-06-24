import Header from "../../components/Header/Header";
import { AgCharts } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-community";
import { useState } from "react";


function getData() {
  return [
    { asset: "Stocks", amount: 60000 },
    { asset: "Bonds", amount: 40000 },
    { asset: "Cash", amount: 7000 },
    { asset: "Real Estate", amount: 5000 },
    { asset: "Commodities", amount: 3000 },
  ];
}
export default function Dashboard() {

const [users, setUsers] = useState([])
  return (
    <>
      <Header />
      <div className="container mt-5 ">
        <div className="row gy-4">
          {/* Tasks Section */}
          <div className="col-md-6">
            <div className="bg-white p-4 rounded-4 shadow-sm">
              <div
                className="border-start border-4 ps-3 mb-3"
                style={{ borderColor: "#EF9B28" }}
              >
                <h6 className="mb-0 fw-bold">Tasks</h6>
                <small className="text-muted">
                  Lorem ipsum dolor sit amet, consectetur
                </small>
              </div>

              <div className="d-flex gap-3 flex-wrap">
                <div className="stat-card bg-light-purple">
                  <i className="fa-solid fa-chart-line mb-2 fs-4 text-dark"></i>
                  <div className="fw-bold">Progress</div>
                  <div>$ 7328.32</div>
                </div>
                <div className="stat-card bg-light-yellow">
                  <i className="fa-solid fa-tasks mb-2 fs-4 text-dark"></i>
                  <div className="fw-bold">Tasks Number</div>
                  <div>1293</div>
                </div>
                <div className="stat-card bg-light-pink">
                  <i className="fa-solid fa-folder-open mb-2 fs-4 text-dark"></i>
                  <div className="fw-bold">Projects Number</div>
                  <div>32</div>
                </div>
              </div>
            </div>
          </div>

          {/* Users Section */}
          <div className="col-md-6">
            <div className="bg-white p-4 rounded-4 shadow-sm">
              <div
                className="border-start border-4 ps-3 mb-3"
                style={{ borderColor: "#EF9B28" }}
              >
                <h6 className="mb-0 fw-bold">Users</h6>
                <small className="text-muted">
                  Lorem ipsum dolor sit amet, consectetur
                </small>
              </div>

              <div className="d-flex gap-3 flex-wrap">
                <div className="stat-card bg-light-purple">
                  <i className="fa-solid fa-user-check mb-2 fs-4 text-dark"></i>
                  <div className="fw-bold">Active</div>
                  <div>$ 7328.32</div>
                </div>
                <div className="stat-card bg-light-yellow">
                  <i className="fa-solid fa-user-slash mb-2 fs-4 text-dark"></i>
                  <div className="fw-bold">Inactive</div>
                  <div>1293</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
