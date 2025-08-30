import React from 'react';
import type {ExportToCSVProps, RowValue} from '../../interfaces/components/Table'

const ExportToCSVButton: React.FC<ExportToCSVProps> = ({data, headers, fileName = 'export.csv', footerValues}) => {

  // setLoading

  const exportToCSV = () => {

    // setLoading(true)

    const csvRows: string[] = [];

    // Header row
    csvRows.push(headers.map(h => `"${h.header}"`).join(','));

    // Data rows
    data.forEach(row => {
      const values = headers.map(h => {
        const val = row[h.accessor as keyof RowValue];
        return `"${val != null ? val : ''}"`;
      });
      csvRows.push(values.join(','));
    });

    // Create and download CSV
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    link.click();
    // setLoading(false)

    footerValues.onCountChange(5)

    document.getElementById('modal-close')?.click()

  };

  return (
    <button
      onClick={exportToCSV}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
    >
      Export to CSV
    </button>
  );
};

export default ExportToCSVButton;