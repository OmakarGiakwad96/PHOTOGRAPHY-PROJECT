export default function DataTable({ columns, rows, emptyMessage = 'No records found.' }) {
  if (!rows || rows.length === 0) {
    return <p className="text-sm text-ink/50 py-10 text-center">{emptyMessage}</p>
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-black/10 text-left text-ink/50 uppercase text-xs tracking-wide">
            {columns.map((col) => (
              <th key={col.key} className="py-3 pr-4 font-medium whitespace-nowrap">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.id ?? idx} className="border-b border-black/5 hover:bg-black/[0.02]">
              {columns.map((col) => (
                <td key={col.key} className="py-3 pr-4 align-middle whitespace-nowrap">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
