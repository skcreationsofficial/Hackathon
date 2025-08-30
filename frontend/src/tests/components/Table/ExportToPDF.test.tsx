import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TableToPDF from "../../../components/Table/TableExportToPdf";

// Mock jsPDF and autotable
jest.mock("jspdf", () => {
  return jest.fn().mockImplementation(() => ({
    setFontSize: jest.fn(),
    text: jest.fn(),
    save: jest.fn(),
  }));
});

jest.mock("jspdf-autotable", () => {
  return jest.fn();
});

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const columns = [
  { header: "Name", accessor: "name", sortable: true },
  { header: "Age", accessor: "age", sortable: true },
  { header: "Email", accessor: "email", sortable: false }, // won't be exported
];

const data = [
  { name: "Alice", age: 30, email: "alice@example.com" },
  { name: "Bob", age: 25, email: "bob@example.com" },
];

// Provide full footerValues matching TableFooterValues interface
const footerValues = {
  page: 1,
  totalPages: 2,
  count: 10,
  onPageChange: jest.fn(),
  onCountChange: jest.fn(),
};

describe("TableToPDF", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock modal close button in DOM
    const modalCloseBtn = document.createElement("button");
    modalCloseBtn.id = "modal-close";
    modalCloseBtn.click = jest.fn();
    document.body.appendChild(modalCloseBtn);
  });

  afterEach(() => {
    const modalCloseBtn = document.getElementById("modal-close");
    if (modalCloseBtn) {
      document.body.removeChild(modalCloseBtn);
    }
  });

  test("renders export button", () => {
    render(<TableToPDF columns={columns} data={data} footerValues={footerValues} />);
    expect(screen.getByText(/Export to PDF/i)).toBeInTheDocument();
  });

  test("calls jsPDF, autotable and footerValues onCountChange on click", () => {
    render(<TableToPDF columns={columns} data={data} footerValues={footerValues} />);

    fireEvent.click(screen.getByText(/Export to PDF/i));

    // Cast jsPDF mock safely
    const jsPDFMock = jsPDF as unknown as jest.Mock;

    expect(jsPDFMock).toHaveBeenCalledTimes(1);
    expect(autoTable).toHaveBeenCalledTimes(1);

    const docInstance = jsPDFMock.mock.results[0].value;
    expect(docInstance.save).toHaveBeenCalledWith("table.pdf");

    expect(footerValues.onCountChange).toHaveBeenCalledWith(5);

    const modalCloseBtn = document.getElementById("modal-close");
    expect(modalCloseBtn?.click).toHaveBeenCalled();
  });
});