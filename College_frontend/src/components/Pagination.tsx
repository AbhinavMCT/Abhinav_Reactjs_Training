import "../styles/pagination.css";

type Props = {
  page: number;
  totalPages: number;
  totalRecords?: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
};

const Pagination = ({
  page,
  totalPages,
  totalRecords = 0,
  limit,
  onPageChange,
  onLimitChange,
}: Props) => {
  return (
    <div className="pagination-container">
      <div className="pagination-info">Total Records: {totalRecords}</div>

      <div className="pagination">
        <label>
          Rows:<select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </label>

        <button disabled={page === 1} onClick={() => onPageChange(page - 1)}>
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={page === index + 1 ? "active" : ""}
            onClick={() => onPageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
