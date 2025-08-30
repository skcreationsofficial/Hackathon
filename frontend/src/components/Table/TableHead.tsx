import React from "react";
import type {TableHeadProps, HeaderValues} from '../../interfaces/components/table' 

 
const TableHead: React.FC<TableHeadProps> = ({ headerValues, handleSort,  sortConfig }) => {
  
  return (
    <thead className="bg-gray-50">
      <tr>
        {headerValues.map((column: HeaderValues, index: number) => (
          <th
            key={index}
            className="border border-gray-200 px-5 py-3 font-semibold text-gray-700 tracking-wide whitespace-nowrap hover:text-blue-600 transition cursor-pointer"
            onClick={() => column.sortable !== false && handleSort(column.accessor)}
          >
            <div className="flex items-center gap-1">
              {column.header}
              {sortConfig?.key === column.accessor && (
                <span className="text-xs">{sortConfig.direction === "asc" ? "▲" : "▼"}</span>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};
 
export default TableHead;