export type Column<T> = {
  title: string;
  key: keyof T;
  render?: (
    value: any,
    record: T
  ) => React.ReactNode;
};

type Props<T> = {
  data: T[];
  columns: Column<T>[];
  rowKey: keyof T; 
};


const CommonTable = <T extends Record<string, any>>({
  data,
  columns,
  rowKey,
}: Props<T>) => {
  return (
    <table>
      <thead>
        <tr>
          {(columns || []).map((column) => (
            <th key={String(column.key)}>
              {column.title}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {(data || []).map((record) => (
          <tr key={String(record[rowKey])}>
            {columns.map((column) => (
              <td key={String(column.key)}>
                {column.render
                  ? column.render(record[column.key], record)
                  : String(record[column.key] ?? "")}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CommonTable;