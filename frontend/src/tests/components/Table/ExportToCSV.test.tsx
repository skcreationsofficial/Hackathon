import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ExportToCSVButton from '../../../components/Table/TableExportCsv';

describe('ExportToCSVButton', () => {
  const mockData = [
    { name: 'Alice', email: 'alice@example.com', phone: '12345' },
    { name: 'Bob', email: 'bob@example.com', phone: '67890' },
  ];

  const mockHeaders = [
    { header: 'Name', accessor: 'name', sortable: true },
    { header: 'Email', accessor: 'email', sortable: true },
    { header: 'Phone', accessor: 'phone', sortable: true },
  ];

  const mockFooterValues = {
    onCountChange: jest.fn(),
    onPageChange: jest.fn(),
    page: 1,
    count: 10,
    totalPages: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock URL.createObjectURL
    global.URL.createObjectURL = jest.fn(() => 'blob:http://example.com/fake-blob');

    // Restore original createElement for test
    document.createElement = document.body.ownerDocument!.createElement.bind(document);

    // Optionally mock click for anchors
    jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  });

  it('renders the export button', () => {
    render(
      <ExportToCSVButton
        data={mockData}
        headers={mockHeaders}
        footerValues={mockFooterValues}
        fileName="test.csv"
      />
    );

    expect(screen.getByText('Export to CSV')).toBeInTheDocument();
  });

  it('generates CSV and triggers download when clicked', () => {
    render(
      <ExportToCSVButton
        data={mockData}
        headers={mockHeaders}
        footerValues={mockFooterValues}
        fileName="test.csv"
      />
    );

    fireEvent.click(screen.getByText('Export to CSV'));

    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(mockFooterValues.onCountChange).toHaveBeenCalledWith(5);
  });

  it('clicks modal close button if present', () => {
    const closeBtn = document.createElement('button');
    closeBtn.id = 'modal-close';
    closeBtn.click = jest.fn();
    document.body.appendChild(closeBtn);

    render(
      <ExportToCSVButton
        data={mockData}
        headers={mockHeaders}
        footerValues={mockFooterValues}
        fileName="test.csv"
      />
    );

    fireEvent.click(screen.getByText('Export to CSV'));
    expect(closeBtn.click).toHaveBeenCalled();

    document.body.removeChild(closeBtn);
  });
});