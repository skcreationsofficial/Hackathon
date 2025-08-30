import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Pagination from "../../../components/Table/TablePagination";

describe("Pagination Component", () => {
  const mockOnPageChange = jest.fn();
  const mockOnCountChange = jest.fn();

  const footerValues = {
    page: 2,
    totalPages: 5,
    count: 10,
    onPageChange: mockOnPageChange,
    onCountChange: mockOnCountChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with pagination controls", () => {
    render(<Pagination footerValues={footerValues} />);

    expect(screen.getByText("← Previous")).toBeInTheDocument();
    expect(screen.getByText("Next →")).toBeInTheDocument();
    expect(screen.getByLabelText("Rows per page:")).toBeInTheDocument();
  });

  it("calls onPageChange with previous page", () => {
    render(<Pagination footerValues={footerValues} />);
    fireEvent.click(screen.getByText("← Previous"));
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it("calls onPageChange with next page", () => {
    render(<Pagination footerValues={footerValues} />);
    fireEvent.click(screen.getByText("Next →"));
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it("calls onCountChange and resets to page 1 when rows per page changes", () => {
    render(<Pagination footerValues={footerValues} />);
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "20" } });

    expect(mockOnCountChange).toHaveBeenCalledWith(20);
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it("disables previous button on first page", () => {
    const values = { ...footerValues, page: 1 };
    render(<Pagination footerValues={values} />);
    expect(screen.getByText("← Previous")).toBeDisabled();
  });

  it("disables next button on last page", () => {
    const values = { ...footerValues, page: 5 };
    render(<Pagination footerValues={values} />);
    expect(screen.getByText("Next →")).toBeDisabled();
  });
});