import React from 'react'
import TableOptions from './TableOptions';
import Pagination from './TablePagination';
import { ToastContainer } from 'react-toastify';
import TableHead from './TableHead';
import TableBody from './TableBody';
import { useState, useCallback, useMemo, useEffect } from "react";
import type {TableComponentProps, RowValue} from '../../interfaces/components/Table'
import UseApiRequest from "../../utils/useApiRequest";

const TableComponent: React.FC<TableComponentProps> = ({headerValues, apiConfig}) => {

    const [sortConfig, setSortConfig] = useState<{ key: keyof RowValue; direction: "asc" | "desc" } | null>(null);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [count, setCount] = useState<number>(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [rowValues, setRowValues] = useState<any[]>([]);


    function useSort(data: RowValue[], sortConfig: { key: keyof RowValue; direction: "asc" | "desc" } | null) {
        return useMemo(() => {
            if (!sortConfig) return data;
        
            return [...data].sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];
            
                if (aVal === bVal) return 0;
                return (aVal > bVal ? 1 : -1) * (sortConfig.direction === "asc" ? 1 : -1);
            });
        }, [data, sortConfig]);
    }

    const handleSort = useCallback((accessor: string) => {
        setSortConfig((prevConfig) => {
        if (prevConfig?.key === accessor) {
            return {
            key: accessor,
            direction: prevConfig.direction === "asc" ? "desc" : "asc",
            };
        }
        return { key: accessor, direction: "asc" };
        });
    }, []);

    const sortedData = useSort(rowValues, sortConfig);

    const crudFunction = useCallback(async () => {

        const query = new URLSearchParams({
            page: page.toString(),
            limit: count.toString(),
            search: searchTerm,
            sortBy: sortField,
            order: sortOrder,
        });
        
        const config = {
            method: apiConfig?.method,
            url: apiConfig?.url,
            query: apiConfig?.query,
            params: apiConfig?.method == "get" ? query : apiConfig?.params,
            data: apiConfig?.data,
            headers: apiConfig?.headers,
            setLoading: setLoading,
            toastEnabled: apiConfig?.toastEnabled,
            operation: apiConfig?.operation
        }

        const data = await UseApiRequest(config)

        console.log('Table data => ', data)

        let response;

        if (apiConfig?.operation == "update") {

            response = rowValues?.map((datum)=>{
                if (datum?._id == data?.data?._id) {
                    return data?.data
                } else {
                    return datum
                }
            })

        } else if (apiConfig?.operation == "create") {

            response = rowValues?.map((datum, index)=>{
                if (index == 0) {
                    return data?.data
                } else {
                    return datum
                }
            })

        } else if (apiConfig?.operation == "delete") {

            response = rowValues?.map((datum)=>{
                if (datum?._id != data?.data?._id) {
                    return datum
                }
            }).filter((datum)=>datum)

        } else {

            response = data?.data?.data

        }

        setRowValues(response);
        apiConfig?.operation=='fetch' && setTotalPages(data?.data?.totalPages || 1);

    }, [page, count, searchTerm, sortField, sortOrder, apiConfig]);

    const footerValues = {
        page: page,
        totalPages: totalPages,
        count: count,
        onPageChange: setPage,
        onCountChange: setCount,
    }

    const tableOptionValues = {
        searchTerm: searchTerm,
        onSearchChange: setSearchTerm,
        sortField: sortField,
        onSortFieldChange: setSortField,
        sortOrder: sortOrder,
        onSortOrderChange: setSortOrder,
    }


    useEffect(() => {
        crudFunction();
    }, [page, crudFunction, apiConfig]);


    return (
        <div className="overflow-x-auto">
            <div>
                <TableOptions headerValues={headerValues} tableOptionValues={tableOptionValues} rowValues={rowValues} footerValues={footerValues} />
                <div className={`overflow-x-auto rounded-xl border border-gray-200 shadow-sm`}>
                    <table className="min-w-full border-collapse text-sm text-left">
                        <TableHead headerValues={headerValues} handleSort={handleSort} sortConfig={sortConfig} />
                        <TableBody headerValues={headerValues} loading={loading} sortedData={sortedData} />
                    </table>
                </div>
                <Pagination footerValues={footerValues} />
                <ToastContainer />
            </div>
        </div>
    );
};

export default TableComponent;