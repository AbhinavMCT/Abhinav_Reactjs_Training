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
};

const CommonTable = <T,>({
  data,
  columns,
}: Props<T>) => {
  return (
    <table>
      <thead>
  <tr>
    {columns.map((column) => (
      <th key={column.title}>
        {column.title}
      </th>
    ))}
  </tr>
</thead>

<tbody>
  {data.map((record, index) => (
    <tr key={index}>
      {columns.map((column) => (
        <td key={column.title}>
          {column.render
            ? column.render(
                record[column.key],
                record
              )
            : String(
                record[column.key] ?? ""
              )}
        </td>
      ))}
    </tr>
  ))}
</tbody>
    </table>
  );
};

export default CommonTable;