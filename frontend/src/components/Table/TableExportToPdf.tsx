// components/TableToPDF.tsx
import React from "react"
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type {ExportPDFProps, HeaderValues, RowValue} from "../../interfaces/components/Table"


const TableToPDF: React.FC<ExportPDFProps> = ({ columns, data, title = "Report", fileName = "table.pdf", footerValues }) => {
  
    const formattedColumns = columns?.map((datum: HeaderValues)=> datum?.sortable == true && datum?.header)?.filter((datum)=>datum)
    const formattedColumnsAccessor = columns?.map((datum: HeaderValues)=> datum?.sortable == true && datum?.accessor)?.filter((datum)=>datum)
    const formattedData = data?.map((datum: RowValue)=> {
        return formattedColumnsAccessor?.map((accessor)=>{
            return datum[accessor as keyof RowValue]
        })?.filter((filterDatum)=>filterDatum)
    })

    const handleExport = () => {
        const doc = new jsPDF();

        if (title) {
        doc.setFontSize(18);
        doc.text(title, 14, 22);
        }

        autoTable(doc, {
        head: [formattedColumns],
        body: formattedData,
        startY: title ? 30 : 10,
        styles: { fontSize: 10 },
        });

        doc.save(fileName);

        footerValues && footerValues.onCountChange(5)

        document.getElementById('modal-close')?.click()

    };

    return (
        <button
        onClick={handleExport}
        className="px-4 py-2 bg-red-800 text-white rounded hover:bg-red-900 transition cursor-pointer"
        >
        Export to PDF
        </button>
    );
};

export default TableToPDF;