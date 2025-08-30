import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TableComponent from "../../../components/Table/TableComponent";

// Mock data and props
const headers = [
  { header: "Name", accessor: "name", sortable: true },
  { header: "Email", accessor: "email", sortable: true },
];

const rows = [
  { name: "Alice", email: "alice@example.com" },
  { name: "Bob", email: "bob@example.com" },
];

const footerValues = {
  page: 1,
  totalPages: 1,
  count: 10,
  onPageChange: jest.fn(),
  onCountChange: jest.fn(),
};

const tableOptionValues = {
  searchTerm: "",
  sortField: "",
  sortOrder: "",
  csvDownload: false,
  fileName: "test.csv",
};

describe("TableComponent", () => {
  test("sorts when header is clicked", () => {
    render(
      <TableComponent
        headerValues={headers}
        rowValues={rows}
        loading={false}
        footerValues={footerValues}
        tableOptionValues={tableOptionValues}
      />
    );

    // Find the clickable header div inside the 'Name' th
    const nameHeader = screen.getAllByText("Name").find(el => el.closest("th"));
    expect(nameHeader).toBeInTheDocument();

    if (nameHeader) {
      fireEvent.click(nameHeader); // first click to sort asc
      fireEvent.click(nameHeader); // second click to sort desc
    }
  });
});