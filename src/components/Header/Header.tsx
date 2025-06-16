
export default function Header({ title, username, description, headerImg }:any) {
  return (
    <>
      <div className="header-container d-flex justify-content-between align-items-center p-md-5 mb-4 ">
        <div className="caption text-white ">
          <div className="mb-3 ">
            <span className="h1 ">{title || "Welcome"}</span>
            <span className="fs-3 mx-3 text-capitalize">
              {username
                ? username
                    .replace(/[0-9]/g, "")
                    .replace(/^\w/, (c) => c.toUpperCase())
                : ""}
            </span>
          </div>

          <p>{description}</p>
        </div>
        {/* <div className="header-img ">
          <img
            className="img-fluid"
            src={headerImg || `/public/home-bg.svg`}
            alt="header-image"
          />
        </div> */}
      </div>
    </>
  );
}
