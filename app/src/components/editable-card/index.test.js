import { render, screen, fireEvent } from "@testing-library/react";
import EditableCard from "./index";
import moment from "moment";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

describe("EditableCard Component", () => {
    const mockProps = {
        id: "1",
        title: "Sample Title",
        description: "Sample description",
        timeStamp: new Date(),
        isEditable: true,
        onEdit: jest.fn(),
        onDelete: jest.fn(),
    };

    const renderWithProvider = (component) =>
      render(
        <LocalizationProvider dateAdapter={AdapterMoment}>
          {component}
        </LocalizationProvider>
    );

    it("renders the title, description, and timestamp correctly", () => {
        renderWithProvider(<EditableCard {...mockProps} />);
        expect(screen.getByText(mockProps.title)).toBeInTheDocument();
        expect(screen.getByText(mockProps.description)).toBeInTheDocument();
        expect(screen.getByText(moment(mockProps.timeStamp).format("DD MMM, YYYY - hh:mm A"))).toBeInTheDocument();
    });

    it("renders edit and delete buttons when isEditable is true", () => {
        renderWithProvider(<EditableCard {...mockProps} />);
        expect(screen.getByLabelText("button-deleted")).toBeInTheDocument();
        expect(screen.getByLabelText("button-edit")).toBeInTheDocument();
    });

    it("does not render edit and delete buttons when isEditable is false", () => {
        renderWithProvider(<EditableCard {...mockProps} isEditable={false} />);
        expect(screen.queryByLabelText("button-deleted")).not.toBeInTheDocument();
        expect(screen.queryByLabelText("button-edit")).not.toBeInTheDocument();
    });

    it("allows the user to toggle edit mode", () => {
        renderWithProvider(<EditableCard {...mockProps} />);
        const editButton = screen.getByLabelText("button-edit");
        fireEvent.click(editButton);

        expect(screen.getByRole("textbox")).toBeInTheDocument(); // TextField visible
        fireEvent.click(editButton);
        expect(screen.queryByRole("textbox")).not.toBeInTheDocument(); // TextField hidden
    });

    it("calls onEdit with updated description when submitted", () => {
        renderWithProvider(<EditableCard {...mockProps} />);
        fireEvent.click(screen.getByLabelText("button-edit"));

        const textField = screen.getByRole("textbox");
        fireEvent.change(textField, { target: { value: "Updated description" } });

        fireEvent.click(screen.getByText("Submit"));
        expect(mockProps.onEdit).toHaveBeenCalledWith("Updated description");
    });

    it("calls onDelete when delete button is clicked", () => {
        renderWithProvider(<EditableCard {...mockProps} />);
        fireEvent.click(screen.getByLabelText("button-deleted"));
        expect(mockProps.onDelete).toHaveBeenCalledWith(mockProps.id);
    });

    it("renders placeholder values when title or description is missing", () => {
        renderWithProvider(<EditableCard {...mockProps} title={null} description={null} />);
        expect(screen.getByText("---")).toBeInTheDocument(); // Placeholder for title
        expect(screen.queryByRole("textbox")).not.toBeInTheDocument(); // Placeholder for description
    });

    it("displays the description in edit mode and updates it on change", () => {
        renderWithProvider(<EditableCard {...mockProps} />);
        fireEvent.click(screen.getByLabelText("button-edit"));

        const textField = screen.getByRole("textbox");
        fireEvent.change(textField, { target: { value: "New description" } });

        expect(textField.value).toBe("New description");
    });
});