export type Column<T> = {
  title: string;
  key: keyof T;
  id?: string; 
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
    {columns.map((column, index) => (
      <th key={column.id ?? `${String(column.key)}-${index}`}>
        {column.title}
      </th>
    ))}
  </tr>
</thead>

<tbody>
  {data.map((record) => (
    <tr key={String(record[rowKey])}>
      {columns.map((column, index) => (
        <td key={column.id ?? `${String(column.key)}-${index}`}>
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