import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PaginationTable from "./index";
import { inputTypes } from "../../constants";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

const mockHeaders = {
    column_1: {
        label: "Column 1",
        align: "left",
        canSort: true,
        input: {
            type: inputTypes.text,
            value: "",
            setValue: jest.fn(),
        },
    },
    column_2: {
        label: "Column 2",
        align: "center",
        width: "20%",
        input: {
            type: inputTypes.select,
            value: 1,
            options: [
                { label: "Option 1", value: 1 },
                { label: "Option 2", value: 2 },
            ],
            setValue: jest.fn(),
        },
    },
    column_3: {
        label: "Column 3",
        align: "right",
        input: {
            type: inputTypes.date,
            value: null,
            setValue: jest.fn(),
        },
    },
};

const mockData = [
    { column_1: "Row 1 Col 1", column_2: "Row 1 Col 2", column_3: "Row 1 Col 3" },
    { column_1: "Row 2 Col 1", column_2: "Row 2 Col 2", column_3: "Row 2 Col 3" },
];

const mockProps = {
    headers: mockHeaders,
    data: mockData,
    pageNumber: 0,
    setPageNumber: jest.fn(),
    totalCount: 20,
    onFilter: jest.fn(),
    onReset: jest.fn(),
    onSortAsc: jest.fn(),
    onSortDesc: jest.fn(),
    sortList: [],
};

const renderWithProvider = (component) =>
render(
    <LocalizationProvider dateAdapter={AdapterMoment}>
        {component}
    </LocalizationProvider>
);

describe("PaginationTable Component", () => {
    test("renders table headers correctly", () => {
        renderWithProvider(<PaginationTable {...mockProps} />);
        Object.values(mockHeaders).forEach((header) => {
            expect(screen.getByText(header.label)).toBeInTheDocument();
        });
    });

    test("renders table data correctly", () => {
        renderWithProvider(<PaginationTable {...mockProps} />);
        mockData.forEach((row, rowIndex) => {
            Object.keys(row).forEach((key) => {
                expect(screen.getByText(row[key])).toBeInTheDocument();
            });
        });
    });

    test("renders Reset and Search buttons", () => {
        renderWithProvider(<PaginationTable {...mockProps} />);
        expect(screen.getByText("Reset")).toBeInTheDocument();
        expect(screen.getByText("Search")).toBeInTheDocument();
    });

    test("calls onFilter when Search button is clicked", () => {
        renderWithProvider(<PaginationTable {...mockProps} />);
        fireEvent.click(screen.getByText("Search"));
        expect(mockProps.onFilter).toHaveBeenCalled();
    });

    test("calls onReset when Reset button is clicked", () => {
        renderWithProvider(<PaginationTable {...mockProps} />);
        fireEvent.click(screen.getByText("Reset"));
        expect(mockProps.onReset).toHaveBeenCalled();
    });

    test("calls setPageNumber when changing page", () => {
        renderWithProvider(<PaginationTable {...mockProps} />);
        fireEvent.click(screen.getByRole("button", { name: "Go to next page" }));
        expect(mockProps.setPageNumber).toHaveBeenCalledWith(1);
    });

    test("renders a dropdown for select filter", () => {
        renderWithProvider(<PaginationTable {...mockProps} />);
        expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    test("calls setValue when typing in text field", () => {
        renderWithProvider(<PaginationTable {...mockProps} />);
        const textFields = screen.getAllByRole("textbox");
        fireEvent.change(textFields[0], { target: { value: "New Value" } });
        expect(mockHeaders.column_1.input.setValue).toHaveBeenCalled();
    });

    test("renders pagination with correct total count", () => {
        renderWithProvider(<PaginationTable {...mockProps} />);
        expect(screen.getByText("Page 1")).toBeInTheDocument();
    });

    test("calls onSortAsc and onSortDesc for sortable columns", () => {
        renderWithProvider(<PaginationTable {...mockProps} />);
        const sortAscButton = screen.getByLabelText("asc-sort-column_1"); 
        fireEvent.click(sortAscButton);
        expect(mockProps.onSortAsc).toHaveBeenCalledWith("column_1");

        const sortDescButton = screen.getByLabelText("desc-sort-column_1");
        fireEvent.click(sortDescButton);
        expect(mockProps.onSortDesc).toHaveBeenCalledWith("column_1");
    });
});