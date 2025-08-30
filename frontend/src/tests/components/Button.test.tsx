import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../../components/Button/Button';
import '@testing-library/jest-dom';

describe('Button Component', () => {
  it('renders with default props', () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-indigo-600');
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Button variant="danger">Delete</Button>);
    expect(screen.getByText('Delete')).toHaveClass('bg-red-600');

    rerender(<Button variant="success">Save</Button>);
    expect(screen.getByText('Save')).toHaveClass('bg-green-600');

    rerender(<Button variant="text">Cancel</Button>);
    expect(screen.getByText('Cancel')).toHaveClass('text-indigo-600');
  });

  it('handles onClick event', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Styled</Button>);
    const button = screen.getByText('Styled');

    expect(button).toHaveClass('custom-class');
  });

  it('passes through native button props', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText('Disabled');

    expect(button).toBeDisabled();
  });
});