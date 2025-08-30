import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import type { HeaderValues, ExportToXLSXProps, RowValue } from '../../interfaces/components/Table';

const ExportToExcelButton: React.FC<ExportToXLSXProps> = ({
  data,
  fileName = 'export.xlsx',
  sheetName = 'Sheet1',
  footerValues,
  headerValues
  // setLoading
}) => {

    
  const exportToExcel = () => {

    // setLoading(true)

    // const formattedColumns = headerValues?.map((datum)=> datum?.sortable == true && datum?.header)?.filter((datum)=>datum)
    const formattedColumnsAccessor = headerValues?.map((datum: HeaderValues)=> datum?.sortable == true && datum?.accessor)?.filter((datum: unknown)=>datum)
    const formattedData = data?.map((datum: RowValue)=> {
        let tempObj: Record<string, string | number | boolean> = {}
        formattedColumnsAccessor?.forEach((accessor: unknown)=>{
            tempObj[String(accessor)] = datum[String(accessor)]
        })
        return tempObj
    })

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([excelBuffer], {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });

    saveAs(blob, fileName);
    // setLoading(false)

    footerValues.onCountChange(5)

    document.getElementById('modal-close')?.click()

  };

  return (
    <button
      onClick={exportToExcel}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
    >
      Export to Excel
    </button>
  );
};

export default ExportToExcelButton;