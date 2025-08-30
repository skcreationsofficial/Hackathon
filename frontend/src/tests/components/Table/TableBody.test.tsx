import React from 'react';
import { render, screen } from '@testing-library/react';
import TableBody from '../../../components/Table/TableBody';
import '@testing-library/jest-dom';

// Mock the LottieLoader to prevent actual animation during test
jest.mock('../../../components/Header/LoadingSpinner', () => () => <div data-testid="loader">Loading...</div>);

// Sample headers and data
const headerValues = [
  { header: 'Name', accessor: 'name', sortable: true },
  { header: 'Status', accessor: 'status', sortable: false, style: 'badge-success' },
];

const sortedData = [
  { name: 'John Doe', status: 'Active' },
  { name: 'Jane Smith', status: 'Active' },
];

describe('TableBody Component', () => {
  it('renders loader when loading is true', () => {
    render(<TableBody headerValues={headerValues} loading={true} sortedData={[]} />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders no data message when not loading and data is empty', () => {
    render(<TableBody headerValues={headerValues} loading={false} sortedData={[]} />);
    expect(screen.getByText('No data available.')).toBeInTheDocument();
  });

  it('renders table rows and cells when data is available', () => {
    render(<TableBody headerValues={headerValues} loading={false} sortedData={sortedData} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getAllByText('Active')).toHaveLength(2);
  });

  it('applies correct badge style classes based on column style', () => {
    const { container } = render(
      <TableBody headerValues={headerValues} loading={false} sortedData={sortedData} />
    );
    const badgeElement = container.querySelector('.bg-green-200');
    expect(badgeElement).toBeInTheDocument();
    expect(badgeElement).toHaveClass('text-green-500');
  });

  it('renders custom render function if provided', () => {
    const headerValuesWithRender = [
      {
        header: 'Name',
        accessor: 'name',
        sortable: true,
        render: (_value: unknown | string) => <span data-testid="custom-render">{(typeof _value == 'string') && _value.toUpperCase()}</span>,
      },
    ];

    render(<TableBody headerValues={headerValuesWithRender} loading={false} sortedData={[{ name: 'john' }]} />);
    expect(screen.getByTestId('custom-render')).toHaveTextContent('JOHN');
  });
});