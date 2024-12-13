import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import ModalForm from './index';
import { inputTypes } from '../../constants';

describe('ModalForm Component', () => {
  const mockFormFields = [
    {
      label: 'Text Input',
      type: inputTypes.text,
      value: '',
      setValue: jest.fn(),
      error: '',
    },
    {
      label: 'Date Input',
      type: inputTypes.date,
      value: null,
      setValue: jest.fn(),
      error: '',
    },
    {
      label: 'Choice Input',
      type: inputTypes.choice,
      value: '',
      setValue: jest.fn(),
      error: '',
      options: [
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' },
      ],
    },
  ];

  const mockOnFormOpen = jest.fn();
  const mockOnFormClose = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProvider = (component) =>
    render(
      <LocalizationProvider dateAdapter={AdapterMoment}>
        {component}
      </LocalizationProvider>
    );

  it('renders the button to open the modal', () => {
    renderWithProvider(
      <ModalForm
        buttonLabel="Open Modal"
        formTitle="Test Form"
        formFields={mockFormFields}
        onFormOpen={mockOnFormOpen}
        onFormClose={mockOnFormClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Open Modal')).toBeInTheDocument();
  });

  it('opens the modal on button click', () => {
    renderWithProvider(
      <ModalForm
        buttonLabel="Open Modal"
        formTitle="Test Form"
        formFields={mockFormFields}
        onFormOpen={mockOnFormOpen}
        onFormClose={mockOnFormClose}
        onSubmit={mockOnSubmit}
      />
    );

    const openButton = screen.getByText('Open Modal');
    fireEvent.click(openButton);

    expect(mockOnFormOpen).toHaveBeenCalled();
    expect(screen.getByText('Test Form')).toBeInTheDocument();
  });

  it('closes the modal on close button click', () => {
    renderWithProvider(
      <ModalForm
        buttonLabel="Open Modal"
        formTitle="Test Form"
        formFields={mockFormFields}
        onFormOpen={mockOnFormOpen}
        onFormClose={mockOnFormClose}
        onSubmit={mockOnSubmit}
      />
    );

    const openButton = screen.getByText('Open Modal');
    fireEvent.click(openButton);

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockOnFormClose).toHaveBeenCalled();
  });

  it('renders form fields inside the modal', () => {
    renderWithProvider(
      <ModalForm
        buttonLabel="Open Modal"
        formTitle="Test Form"
        formFields={mockFormFields}
        onFormOpen={mockOnFormOpen}
        onFormClose={mockOnFormClose}
        onSubmit={mockOnSubmit}
      />
    );

    fireEvent.click(screen.getByText('Open Modal'));

    expect(screen.getByLabelText('Text Input')).toBeInTheDocument();
    expect(screen.getByText('Date Input')).toBeInTheDocument();
    expect(screen.getByText('Choice Input')).toBeInTheDocument();
  });

  it('calls onSubmit when the submit button is clicked', () => {
    renderWithProvider(
      <ModalForm
        buttonLabel="Open Modal"
        formTitle="Test Form"
        formFields={mockFormFields}
        onFormOpen={mockOnFormOpen}
        onFormClose={mockOnFormClose}
        onSubmit={mockOnSubmit}
      />
    );

    fireEvent.click(screen.getByText('Open Modal'));

    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('shows error messages when form fields have errors', () => {
    const mockFormFieldsWithError = [
      {
        label: 'Text Input',
        type: inputTypes.text,
        value: '',
        setValue: jest.fn(),
        error: 'This field is required',
      },
    ];

    renderWithProvider(
      <ModalForm
        buttonLabel="Open Modal"
        formTitle="Test Form"
        formFields={mockFormFieldsWithError}
        onFormOpen={mockOnFormOpen}
        onFormClose={mockOnFormClose}
        onSubmit={mockOnSubmit}
      />
    );

    fireEvent.click(screen.getByText('Open Modal'));

    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });
});
