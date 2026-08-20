import type { ReactNode } from "react";

export type TableColumn<T> = {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  align?: "left" | "right";
  hideOnMobile?: boolean;
};

type ResponsiveTableProps<T> = {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  empty?: string;
};

export function ResponsiveTable<T>({ columns, rows, rowKey, empty = "No records found." }: ResponsiveTableProps<T>) {
  const mobileColumns = columns.filter((c) => !c.hideOnMobile);

  return (
    <>
      <div className="table-wrap hidden md:block">
        <table className="w-full text-sm">
          <thead className="table-head">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`p-4 ${col.align === "right" ? "text-right" : "text-left"}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-6 text-center text-slate-500">
                  {empty}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={rowKey(row)} className="table-row border-t border-slate-200">
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`p-4 ${col.align === "right" ? "text-right" : ""}`}
                    >
                      {col.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {rows.length === 0 ? (
          <div className="mobile-data-card text-center text-sm text-slate-500 py-6">{empty}</div>
        ) : (
          rows.map((row) => (
            <div key={rowKey(row)} className="mobile-data-card">
              {mobileColumns.map((col) => (
                <div key={col.key} className="mobile-data-row">
                  <span className="mobile-data-label">{col.header}</span>
                  <span className={`mobile-data-value ${col.align === "right" ? "justify-end" : ""}`}>
                    {col.cell(row)}
                  </span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </>
  );
}
