import type { ReactElement } from "react"

// Table header :
// --------------

export interface HeaderValues {
    header: string;
    accessor: string;
    sortable: boolean;
    render?: (_value?: unknown | string, row?: unknown | string)=>ReactElement;
    style?: string;
}

export interface SortConfig {
    key?: string | number | symbol;
    direction?: string | number | symbol;
}

export interface TableHeadProps {
    headerValues: HeaderValues[];
    sortConfig: SortConfig | null;
    handleSort: (accessor: string)=>void;
}

// ---------------------------------------------------------------------------------------------------------

export interface SortedData {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  role?: string;
}

export interface TableBodyProps {
  headerValues: HeaderValues[];
  data?: [];
  className?: string;
  loading?: boolean;
  sortedData: SortedData[];
};

// ---------------------------------------------------------------------------------------------------------

// Table Footer :
// --------------

export interface TableFooterValues {
  page: number;
  totalPages: number;
  count: number;
  onCountChange: (value: number)=>void;
  onPageChange: (value: number)=>void;
}

export interface TableFooterProps {
  footerValues: TableFooterValues;
}

// ----------------------------------------------------------------------------------------------------

// Table options :
// ---------------

export interface TableOptionsProps {
  headerValues: HeaderValues[];
  tableOptionValues: TableOptionValues;
  rowValues: RowValue[];
  footerValues: TableFooterValues;
}

export interface TableOptionValues {
  searchTerm: string;
  sortField: string;
  sortOrder: string;
  onSortOrderChange?: React.Dispatch<React.SetStateAction<string>>;
  onSortFieldChange?: React.Dispatch<React.SetStateAction<string>>;
  onSearchChange?: React.Dispatch<React.SetStateAction<string>>;
}

export type RowValue = any

// ----------------------------------------------------------------------------------------------------------

// Export to CSV :
// ---------------

export interface ExportToCSVProps {
  data: RowValue[]
  headers: HeaderValues[]
  fileName: string
  footerValues: TableFooterValues
}

// -----------------------------------------------------------------------------------------------------------

// Export to XLSX :
// ----------------

export interface ExportToXLSXProps {
  data: RowValue[]
  headerValues: HeaderValues[]
  fileName: string;
  sheetName: string;
  footerValues: TableFooterValues
}

// -----------------------------------------------------------------------------------------------------------

// Table Component :
// -----------------

export interface ApiConfig {
  method: 'get' | 'post' | 'patch' | 'put' | 'delete';
  url: string;
  query: unknown,
  params: unknown,
  data: unknown,
  headers: unknown,
  toastEnabled: boolean;
  operation: 'fetch' | 'create' | 'update' | 'delete',
  setLoading?: (value: boolean)=>void;
}

export interface TableComponentProps extends TableOptionsProps {
  headerValues: HeaderValues[];
  apiConfig: ApiConfig;
}

// -----------------------------------------------------------------------------------------------------------

// Export to PDF :
// ---------------

export interface ExportPDFProps {
  columns: HeaderValues[];
  data?: RowValue[];
  title?: string;
  fileName?: string;
  footerValues?: TableFooterValues;
}