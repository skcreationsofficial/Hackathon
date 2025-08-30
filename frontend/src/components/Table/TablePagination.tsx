// components/Pagination/Pagination.tsx
import React from "react";
import Button from "../Button/Button";
import CustomSelect from "./CustomSelect/CustomSelect";
import type { TableFooterProps } from "../../interfaces/components/table";
 
const Pagination: React.FC<TableFooterProps> = ({footerValues}) => {

    const handleCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCount = parseInt(e.target.value, 10);
        footerValues?.onCountChange(newCount);
        footerValues?.onPageChange(1); // Reset to page 1 when count changes
    };
 
    const pageSizeOptions = [
        { name: "5", value: 5 },
        { name: "10", value: 10 },
        { name: "20", value: 20 },
        { name: "50", value: 50 },
    ];
 
    return (
        <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
                <Button
                onClick={() => footerValues?.onPageChange(footerValues?.page - 1)}
                disabled={footerValues?.page === 1}
                className="h-[32px] px-3 rounded-md border border-gray-300 bg-blue-500 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                ← Previous
                </Button>
                <span className="text-sm text-gray-600">
                Page <span className="font-semibold text-gray-800">{footerValues?.page}</span> of <span className="font-semibold text-gray-800">{footerValues?.totalPages}</span>
                </span>
                <Button
                onClick={() => footerValues?.onPageChange(footerValues?.page + 1)}
                disabled={footerValues?.page === footerValues?.totalPages}
                className="h-[32px] px-3 rounded-md border border-gray-300 bg-blue-500 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                Next →
                </Button>
            </div>

            <div className="flex items-center gap-3">
                <label htmlFor="pageSize" className="text-sm font-medium text-gray-700">
                Rows per page:
                </label>
                <CustomSelect
                    name="pageSize"
                    value={footerValues?.count}
                    onChange={handleCountChange}
                    options={pageSizeOptions}
                />
            </div>
        </div>

    );
};
 
export default Pagination;