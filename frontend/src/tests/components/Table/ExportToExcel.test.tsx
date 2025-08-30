import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ExportToExcelButton from '../../../components/Table/TableExportExcel';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Mock the dependencies
jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

jest.mock('xlsx', () => ({
  utils: {
    json_to_sheet: jest.fn(() => ({ A1: { v: 'Test' } })),
    book_new: jest.fn(() => ({})),
    book_append_sheet: jest.fn(),
  },
  write: jest.fn(() => new ArrayBuffer(10)),
}));

describe('ExportToExcelButton', () => {
  const mockFooterValues = {
    onCountChange: jest.fn(),
    page: 1,
    totalPages: 1,
    count: 1,
    onPageChange: jest.fn(),
  };

  const mockHeaderValues = [
    { accessor: 'name', header: 'Name', sortable: true },
    { accessor: 'age', header: 'Age', sortable: true },
  ];

  const mockData = [
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 25 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the export button', () => {
    const { getByText } = render(
      <ExportToExcelButton
        data={mockData}
        fileName="test.xlsx"
        headerValues={mockHeaderValues}
        footerValues={mockFooterValues}
        sheetName="new"
      />
    );

    expect(getByText('Export to Excel')).toBeInTheDocument();
  });

  it('calls saveAs and footer callback when clicked', () => {
    const closeBtn = document.createElement('button');
    closeBtn.id = 'modal-close';
    document.body.appendChild(closeBtn);

    const { getByText } = render(
      <ExportToExcelButton
        data={mockData}
        fileName="test.xlsx"
        headerValues={mockHeaderValues}
        footerValues={mockFooterValues}
        sheetName="new"
      />
    );

    fireEvent.click(getByText('Export to Excel'));

    expect(XLSX.utils.json_to_sheet).toHaveBeenCalled();
    expect(XLSX.write).toHaveBeenCalled();
    expect(saveAs).toHaveBeenCalled();
    expect(mockFooterValues.onCountChange).toHaveBeenCalledWith(5);

    // Optional: Check if modal-close was clicked
    // You could spy on closeBtn.click if needed
  });
});