import { vi } from "vitest";

export const mockNavigate = vi.fn(() => ({}));
export const mockUseParams = vi.fn(() => ({}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<
    typeof import("react-router-dom")
  >("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
  };
});

vi.mock("../hoc/withCrudPage.tsx", () => ({
  default: (Component: any) => {
    console.log("MOCK HOC USED");
    return (props: any) => <Component {...props} />;
  },
}));

vi.mock("../components/Breadcrumbs.tsx", () => ({
  default: () => <div>Breadcrumbs</div>,
}));

vi.mock("../components/CommonSearch.tsx", () => ({
  default: () => <input data-testid="search-input" placeholder="Search" />,
}));

vi.mock("../components/Pagination.tsx", () => ({
  default: () => <div>Pagination</div>,
}));

vi.mock("../components/DeleteButton.tsx", () => ({
  default: ({ id, onDelete }: any) => (
    <button onClick={() => onDelete(id)}>Delete</button>
  ),
}));

vi.mock("../components/ConfirmModal.tsx", () => ({
  default: ({ isOpen, onConfirm, onCancel }: any) =>
    isOpen ? (
      <div>
        <button onClick={onConfirm}>Confirm</button>

        {onCancel && <button onClick={onCancel}>Cancel</button>}
      </div>
    ) : null,
}));

vi.mock("../components/CommonTable.tsx", () => ({
  default: ({ data = [], columns = [] }: any) => (
    <table>
      <tbody>
  {data?.map((row: any, rowIndex: number) => (
    <tr key={row.id ?? rowIndex}>
      {columns.map((col: any, colIndex: number) => (
        <td key={`${rowIndex}-${col.key}-${colIndex}`}>
          {col.render
            ? col.render(row[col.key], row)
            : row[col.key]}
        </td>
      ))}
    </tr>
  ))}
</tbody>
    </table>
  ),
}));

vi.mock("../components/ViewComponent.tsx", () => ({
  default: ({ data = [], columns = [] }: any) => (
    <table>
      <tbody>
        {data.map((row: any, rowIndex: number) => (
          <tr key={rowIndex}>
            {columns.map((column: any, columnIndex: number) => (
              <td key={columnIndex}>
                {column.render
                  ? column.render(row[column.key], row)
                  : row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}));

vi.mock("../components/ImportStudentModal.tsx", () => ({
  default: ({ isOpen, onClose }: any) =>
    isOpen ? (
      <div>
        Import Modal <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock("../utils/Jwt.ts", () => ({
  decodeToken: vi.fn(),
}));
