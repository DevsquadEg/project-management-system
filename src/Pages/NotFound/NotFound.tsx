import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <>
      <div
        style={{
          backgroundImage: `url("/public/backgroundNot.svg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",

          height: "100vh",
          width: "100vw",
        }}
      >
        <div className="row h-100 m-0">
          <div className="offset-6 col-6 d-flex flex-column justify-content-center align-items-center h-100  ">
            <h1
              style={{
                fontFamily: "sans-serif",
                fontSize: "212px",
                fontStyle: "normal",
                fontWeight: 800,
                lineHeight: "240px",
                marginBottom: "20px",
                color: "#578787",
              }}
            >
              404
            </h1>

            <p
              className="text-center mb-4"
              style={{
                color: "#18120F",
                textAlign: "center",
                fontFamily: "sans-serif",
                fontSize: "32px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "40px",
              }}
            >
              Sorry, You Are Not Allowed to Access This Page.
            </p>
            <button
              className="text-white btn btn-success btn-lg mt-5 p-3 px-5"
              onClick={() => navigate("/")}
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
