import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TableHead from '../../../components/Table/TableHead';
import '@testing-library/jest-dom';

// Sample header config
const headerValues = [
  { header: 'Name', accessor: 'name', sortable: true },
  { header: 'Email', accessor: 'email', sortable: true },
  { header: 'Status', accessor: 'status', sortable: false },
];

// Utility to find column header cell
const getHeader = (text: string) => screen.getByText(text).closest('th');

describe('TableHead Component', () => {
  it('renders all headers', () => {
    const mockSort = jest.fn();

    render(<TableHead headerValues={headerValues} handleSort={mockSort} sortConfig={null} />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('calls handleSort when sortable header is clicked', () => {
    const mockSort = jest.fn();

    render(<TableHead headerValues={headerValues} handleSort={mockSort} sortConfig={null} />);

    fireEvent.click(getHeader('Name')!);
    fireEvent.click(getHeader('Email')!);

    expect(mockSort).toHaveBeenCalledTimes(2);
    expect(mockSort).toHaveBeenCalledWith('name');
    expect(mockSort).toHaveBeenCalledWith('email');
  });

  it('does not call handleSort when non-sortable header is clicked', () => {
    const mockSort = jest.fn();

    render(<TableHead headerValues={headerValues} handleSort={mockSort} sortConfig={null} />);

    fireEvent.click(getHeader('Status')!);

    expect(mockSort).not.toHaveBeenCalledWith('status');
  });

  it('shows sort indicator based on sortConfig', () => {
    const mockSort = jest.fn();

    const sortConfig = {
      key: 'email',
      direction: 'asc',
    };

    render(<TableHead headerValues={headerValues} handleSort={mockSort} sortConfig={sortConfig} />);

    const emailHeader = getHeader('Email');
    expect(emailHeader).toHaveTextContent('▲');
  });
});