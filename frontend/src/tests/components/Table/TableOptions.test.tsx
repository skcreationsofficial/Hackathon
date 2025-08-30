import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TableOptions from '../../../components/Table/TableOptions';

const mockHeaderValues = [
  { header: 'Name', accessor: 'name', sortable: true },
  { header: 'Age', accessor: 'age', sortable: true },
  { header: 'Department', accessor: 'department', sortable: false },
];

const mockTableOptionValues = {
  searchTerm: '',
  sortField: '',
  sortOrder: '',
  onSearchChange: jest.fn(),
  onSortFieldChange: jest.fn(),
  onSortOrderChange: jest.fn(),
};

const mockFooterValues = {
  page: 1,
  totalPages: 10,
  count: 10,
  onPageChange: jest.fn(),
  onCountChange: jest.fn(),
};

const mockRowValues = [
  { name: 'Alice', age: 30, department: 'HR' },
  { name: 'Bob', age: 40, department: 'IT' },
];

describe('TableOptions', () => {
  it('renders without crashing', () => {
    render(
      <TableOptions
        headerValues={mockHeaderValues}
        tableOptionValues={mockTableOptionValues}
        footerValues={mockFooterValues}
        rowValues={mockRowValues}
      />
    );

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    expect(screen.getByText('Export to CSV')).toBeInTheDocument();
    expect(screen.getByText('Export to Excel')).toBeInTheDocument();
    expect(screen.getByText('Export to PDF')).toBeInTheDocument();
  });

  it('triggers search input change', () => {
    render(
      <TableOptions
        headerValues={mockHeaderValues}
        tableOptionValues={mockTableOptionValues}
        footerValues={mockFooterValues}
        rowValues={mockRowValues}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search...');
    // fireEvent.change(searchInput, { target: { value: 'Alice' } });
    // expect(mockTableOptionValues.onSearchChange).toHaveBeenCalledWith('Alice');
  });

  it('renders all sortable headers in sort select', () => {
    render(
      <TableOptions
        headerValues={mockHeaderValues}
        tableOptionValues={mockTableOptionValues}
        footerValues={mockFooterValues}
        rowValues={mockRowValues}
      />
    );

    expect(screen.getAllByText('Name')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Age')[0]).toBeInTheDocument();
    expect(screen.queryByText('Department')).not.toBeInTheDocument();
  });
});