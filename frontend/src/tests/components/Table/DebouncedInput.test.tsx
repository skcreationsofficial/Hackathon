import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DebouncedInput from '../../../components/Table/DebouncedInput/DebouncedInput';
import '@testing-library/jest-dom';

jest.useFakeTimers();

describe('DebouncedInput Component', () => {
  it('renders with initial value', () => {
    render(
      <DebouncedInput value="hello" onChange={jest.fn()} />
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('hello');
  });

  it('updates internal value and calls onChange after debounce', () => {
    const handleChange = jest.fn();

    render(
      <DebouncedInput value="" onChange={handleChange} debounce={500} />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Debounced' } });

    expect(input).toHaveValue('Debounced');

    // before debounce timeout
    expect(handleChange).not.toHaveBeenCalled();

    // advance timers by 500ms
    jest.advanceTimersByTime(500);

    expect(handleChange).toHaveBeenCalledWith('Debounced');
  });

  it('resets internal value when initialValue changes', () => {
    const { rerender } = render(
      <DebouncedInput value="first" onChange={jest.fn()} />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('first');

    rerender(
      <DebouncedInput value="second" onChange={jest.fn()} />
    );

    expect(input).toHaveValue('second');
  });

  it('supports custom type and placeholder', () => {
    render(
      <DebouncedInput
        value=""
        onChange={jest.fn()}
        type="search"
        placeholder="Search..."
      />
    );

    const input = screen.getByPlaceholderText('Search...');
    expect(input).toHaveAttribute('type', 'search');
  });
});