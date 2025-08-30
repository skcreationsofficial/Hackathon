import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomSelect from '../../../components/Table/CustomSelect/CustomSelect';

describe('CustomSelect Component', () => {
  const options = [
    { name: 'Option A', value: 'a' },
    { name: 'Option B', value: 'b' },
  ];

  const mockChange = jest.fn();

  it('renders label and options correctly', () => {
    render(
      <CustomSelect
        name="test-select"
        label="Choose option"
        value="a"
        options={options}
        onChange={mockChange}
      />
    );

    expect(screen.getByLabelText(/choose option/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Option A' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Option B' })).toBeInTheDocument();
  });

  it('calls onChange when selection changes', () => {
    render(
      <CustomSelect
        name="test-select"
        value="a"
        options={options}
        onChange={mockChange}
      />
    );

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'b' },
    });

    expect(mockChange).toHaveBeenCalledTimes(1);
  });

  it('displays error text when err prop is provided', () => {
    render(
      <CustomSelect
        name="test-select"
        value="a"
        options={options}
        onChange={mockChange}
        err="This field is required"
      />
    );

    expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
  });

  it('renders as disabled when disabled prop is true', () => {
    render(
      <CustomSelect
        name="test-select"
        value="a"
        options={options}
        onChange={mockChange}
        disabled
      />
    );

    expect(screen.getByRole('combobox')).toBeDisabled();
  });
});