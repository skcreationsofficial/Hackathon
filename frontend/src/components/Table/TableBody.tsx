import React from "react";
import LottieLoader from '../Header/LoadingSpinner';
import type {HeaderValues, TableBodyProps, SortedData} from '../../interfaces/components/table'
 
 
const TableBody: React.FC<TableBodyProps> = ({ headerValues, loading = false, sortedData }) => {

  const handleColumnStyle = (styleValue: string) => {

    if (styleValue.includes("badge")) {
      if (styleValue.includes("success")) {
        return "rounded-full bg-green-200 font-bold text-green-500 p-2 text-xs"
      } else if (styleValue.includes("warning")) {
        return "rounded-full bg-yellow-200 font-bold text-yellow-500 p-2 text-xs"
      } else if (styleValue.includes("danger")) {
        return "rounded-full bg-red-200 font-bold text-red-500 p-2 text-xs"
      }
    } else {
      return ""
    }
    
  }

  
  
  return (
    <tbody className="bg-white">
      {loading && (
        <tr className="absolute inset-0 flex items-center justify-center z-10 bg-white/60 backdrop-blur-sm">
          <td colSpan={headerValues.length} className="text-center py-10 border border-gray-200">
            <LottieLoader />
          </td>
        </tr>
      )}
      {!loading && sortedData.length === 0 && (
        <tr>
          <td colSpan={headerValues.length} className="text-center py-10 text-gray-500 border border-gray-200">
            No data available.
          </td>
        </tr>
      )}
      {sortedData.map((row: SortedData, rowIndex: number) => {

        return <tr key={rowIndex} className="hover:bg-gray-50 transition-colors duration-150">
          {headerValues.map((column: HeaderValues, colIndex: number) => {
            const style = column?.style && handleColumnStyle(column?.style)
            return <td
              key={colIndex}
              className={`border border-gray-200 px-5 py-3 text-gray-800 whitespace-nowrap`}
            >
              <span className={style}>
                {column.render
                  ? column.render(row[column.accessor as keyof SortedData], row)
                  : String(row[column.accessor as keyof SortedData])}
              </span>
            </td>
          })}
        </tr>
      })}
    </tbody>
  );
};
 
export default TableBody;