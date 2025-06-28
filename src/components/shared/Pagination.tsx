type PaginationProps = {
  pageSize: number;
  setPageSize: (e: number | ((prev: number) => number)) => void;
  totalNumberOfRecords: number;
  pageNumber: number;
  totalPages: number;
  setPageNumber: (e: number | ((prev: number) => number)) => void;
};

const Pagination = ({
  pageSize,
  setPageSize,
  totalNumberOfRecords,
  pageNumber,
  totalPages,
  setPageNumber,
}: PaginationProps) => {
  return (
    <div className="d-flex justify-content-end align-items-center p-3    gap-5">
      <div className="d-flex align-items-center gap-2">
        <span>Showing</span>
        <select
          className="form-select border rounded-pill px-3 py-1 selectEnhance"
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          <option disabled hidden value={pageSize}>
            {pageSize}
          </option>
          <option value="3">3</option>
          <option value="6">6</option>
          <option value="12">12</option>
        </select>
        <span>of {totalNumberOfRecords} Results</span>
      </div>

      <div className="d-flex align-items-center gap-3">
        <span>
          Page {pageNumber} of {totalPages}
        </span>
        <div className="d-flex gap-3">
          <button
            className="btn btn-white border-0 p-1"
            disabled={pageNumber === 1}
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
          >
            <i className="bi bi-chevron-left fs-5 text-secondary"></i>
          </button>
          <button
            className="btn btn-white border-0 p-1"
            disabled={pageNumber === totalPages}
            onClick={() =>
              setPageNumber((prev) => Math.min(prev + 1, totalPages))
            }
          >
            <i className="bi bi-chevron-right fs-5 text-secondary"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
