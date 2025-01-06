import { 
    Button, 
    CircularProgress, 
    FormControl, 
    FormControlLabel, 
    FormHelperText, 
    IconButton, 
    MenuItem, 
    Modal, 
    Radio, 
    RadioGroup, 
    Select, 
    TextField, 
    Tooltip} from "@mui/material"
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { inputTypes } from "../../constants";
import { Component, useState } from "react";
import { 
    Container,
    Title,
    TitleContainer,
    FormContainer,
    ButtonContainer,
    Header,
    InputContainer,
    Label,
    ErrorHelperText,
    FileLabel,
    Row
} from "./index.style";
import CloseIcon from '@mui/icons-material/Close';
import PasswordInput from "../password-input";

/**
 * A reusable modal form component built with Material-UI.
 * This component dynamically renders form fields based on the provided configuration.
 * 
 * @component
 *
 * @param {Object} props - The properties for the ModalForm component.
 * @param {Component} props.buttonIcon - The icon for the button that opens the modal.
 * @param {string} props.buttonLabel - The label for the button that opens the modal.
 * @param {string} props.buttonVariant - The variant for the button that opens the modal. Same as the variant for MIUI Button.
 * @param {string} props.buttonColor - The color for the button that opens the modal. Same as the color for MIUI Button.
 * @param {string} props.formTitle - The title displayed at the top of the modal.
 * @param {Array<Object>} props.formFields - Array of form field configurations.
 * @param {string} props.formFields[].label - Label for the input field.
 * @param {string} props.formFields[].type - Type of input field (refer inputTypes in constants).
 * @param {any} props.formFields[].value - Current value of the input field.
 * @param {function} props.formFields[].setValue - Callback function to update the input field value.
 * @param {string} [props.formFields[].error] - Error message for the input field.
 * @param {Array<Object>} [props.formFields[].options] - Options for inputTypes.choice and inputTypes.select input types.
 * @param {function} [props.onFormOpen] - Callback triggered when the modal is opened.
 * @param {function} [props.onFormClose] - Callback triggered when the modal is closed.
 * @param {function} [props.onSubmit] - Promise triggered when the form is submitted.
 * 
 * @example
 * 
 * 
 *   const formFields = [
 *     {
 *       label: "Text Input",
 *       type: inputTypes.text,
 *       value: textValue,
 *       setValue: (e) => setTextValue(e.target.value),
 *       error: ""
 *     },
 *     {
 *       label: "Select Input",
 *       type: inputTypes.select,
 *       value: selectValue,
 *       setValue: (e) => setSelectValue(e.target.value),
 *       options: [
 *         { label: "Option 1", value: "option1" },
 *         { label: "Option 2", value: "option2" }
 *       ],
 *       error: ""
 *     },
 *     {
 *       label: "Date Picker",
 *       type: inputTypes.date,
 *       value: dateValue,
 *       setValue: (value) => setDateValue(value),
 *       error: ""
 *     },
 *     {
 *       label: "Time Picker",
 *       type: inputTypes.time,
 *       value: timeValue,
 *       setValue: (value) => setTimeValue(value),
 *       error: ""
 *     },
 *     {
 *       label: "Image",
 *       type: inputTypes.image,
 *       value: file,
 *       setValue: (file) => setFileValue(file),
 *       error: ""
 *     },
 *      [ //for multiple inputs in sthe same line
 *            {
 *                width: '40%',
 *                error: false,
 *                type: inputTypes.select,
 *                value: filterInput.dateLookup,
 *                setValue: (event) =>  setFilterInput({
 *                    ...filterInput,
 *                    dateLookup: event.target.value
 *                }),
 *                options: [
 *                  {
 *                    label: 'On',
 *                    value: 'e'
 *                  },
 *                  {
 *                    label: 'Before',
 *                    value: 'lt'
 *                  },
 *                  {
 *                    label: 'After',
 *                    value: 'gt'
 *                  }
 *                ]      
 *            },
 *            {
 *                width: '60%',
 *                label: 'Date',
 *                type: inputTypes.date,
 *                value: filterInput.date,
 *                setValue: (value) =>  {
 *                    const parsedDate = moment(value);
 *                    setFilterInput({
 *                        ...filterInput,
 *                        date: parsedDate
 *                    });
 *                }
 *            },
 *        ],
 *   ];
 * 
 *   <ModalForm
 *       buttonIcon={</>}
 *       buttonLabel="Open Form"
 *       formTitle="Example Modal Form"
 *       formFields={formFields}
 *       onFormOpen={() => console.log("Form opened")}
 *       onFormClose={() => console.log("Form closed")}
 *       onSubmit={new Promise(resolve, reject) => resolve(console.log(("Form submitted"))}
 *     />\
 * 
 * @returns {JSX.Element} A `Modal` commponent.
 * 
 */
export default function ModalForm(props){
    const {
        buttonIcon,
        buttonLabel,
        buttonVariant,
        buttonColor,
        formTitle,
        formFields,
        onFormOpen,
        onFormClose,
        onSubmit
    } = props;

    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () => {
        if(onFormClose){
            onFormClose();
        }
        setVisible(false);
    }

    const handleSubmitClick = () => {
        setIsLoading(true);
        onSubmit()
        .then(() => {
            setIsLoading(false);
            handleClose();
        })
        .catch(() => setIsLoading(false));
    }

    const openFileSelect = (label) => {
        const selector = document.getElementById(`image-select-${label}`);
        if(selector){
            selector.click();
        }
    }

    const handleFileChange = (event, setValue) => {
        const file = event.target.files[0];
        if (file) {
            setValue(file);
        }
    };

    const getInput = (formItem, formTitle, index, noPadding = false) => {
        return <InputContainer key={`form-${formTitle}-${index}`} width={formItem.width} noPadding={noPadding}>
        {
            (
                formItem.type === inputTypes.textArea ||
                formItem.type === inputTypes.choice ||
                formItem.type === inputTypes.select ||
                formItem.type === inputTypes.date ||
                formItem.type === inputTypes.time
            ) &&
            <Label>{formItem.label}</Label>
        }
        {
            formItem.type === inputTypes.text &&
            <TextField
                sx={{width: '96%'}}
                error = {formItem.error}
                value = {formItem.value}
                onChange={formItem.setValue}
                label={formItem.label} 
                helperText = {formItem.error}
                variant="outlined" />
        }
        {
            formItem.type === inputTypes.textArea &&
            <TextField
                sx={{width: '96%'}}
                multiline
                rows={5}
                variant='outlined'
                value={formItem.value}
                onChange={formItem.setValue}
                error={formItem.error}
                helperText={formItem.error}/>
        }
        {
            formItem.type === inputTypes.password &&
            <PasswordInput
                error = {formItem.error}
                value = {formItem.value}
                onChange={formItem.setValue}
                label={formItem.label} 
                helperText = {formItem.error}/>
        }
        {
            formItem.type === inputTypes.choice &&
            <FormControl>
                <RadioGroup
                    row
                    value={formItem.value}
                    onChange={formItem.setValue}>
                    {
                        formItem.options.map((option, index) => {
                            return <FormControlLabel
                            key={`radio-${index}-${option.value}`}
                            value={option.value}
                            control={<Radio />}
                            label={option.label}/>
                        })
                    }
                </RadioGroup>
                {
                    formItem.error &&
                    <ErrorHelperText>
                        {formItem.error}
                    </ErrorHelperText>
                }
            </FormControl>
        }
        {
            formItem.type === inputTypes.select &&
            <FormControl fullWidth error>
                <Select
                sx={{width: '96%'}}
                variant='outlined'
                error={formItem.error}
                value={formItem.value}
                onChange={formItem.setValue}
                >
                {
                    formItem.options.map((option, index) => {
                        return(
                            <MenuItem 
                                key={`option-${option.label}-${index}`} 
                                value={option.value}>
                                {option.label}
                            </MenuItem>
                        );
                    })
                }
                </Select>
                {
                    formItem.error &&
                    <FormHelperText>{formItem.error}</FormHelperText>
                }
            </FormControl>
        }
        {
            formItem.type === inputTypes.date &&
            <FormControl>
                <DatePicker
                sx={{width: '96%'}}
                variant='outlined'
                error={formItem.error}
                value={formItem.value}
                format="DD MMM, YYYY"
                onChange={formItem.setValue}/>
                {
                    formItem.error &&
                    <ErrorHelperText>{formItem.error}</ErrorHelperText>
                }
            </FormControl>
        }
        {
            formItem.type === inputTypes.time &&
            <FormControl>
                <TimePicker
                sx={{width: '96%'}}
                variant='outlined'
                error={formItem.error}
                value={formItem.value}
                onChange={formItem.setValue}/>
                {
                    formItem.error &&
                    <ErrorHelperText>{formItem.error}</ErrorHelperText>
                }
            </FormControl>
        }
        {
            formItem.type === inputTypes.image &&
            <Row>
                <input
                    id={`image-select-${formItem.label}`}
                    type="file"
                    hidden
                    accept={'image/*'}
                    onChange={(e) => handleFileChange(e, formItem.setValue)}
                />
                <Button
                    onClick={() => openFileSelect(formItem.label)}
                    variant="outlined">
                    {`Select ${formItem.label}`}
                </Button>
                <FileLabel
                    isSelected = {formItem.value}>
                    {
                        formItem.value ? 
                        <Tooltip title={formItem.value.name}>
                            {formItem.value.name}
                        </Tooltip> :
                        '...'
                    }
                </FileLabel>
            </Row>
        }
        </InputContainer>
    }

    return <>
        {
            (
                buttonIcon ||
                buttonLabel
            ) &&
            <Button
                color={buttonColor ?? "primary"}
                variant={buttonVariant ?? "contained"}
                onClick={
                    () => {
                        if(onFormOpen){
                            onFormOpen();
                        }
                        setVisible(true);
                    }
                }>
                {buttonIcon}
                {buttonLabel}
            </Button>
        }
        <Modal
        open={visible}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}
        >
            <Container>
                <Header>
                    <TitleContainer>
                        <Title>{formTitle}</Title>
                    </TitleContainer>
                    <Button 
                        aria-label="close"
                        style={{
                            flexGrow: 1
                        }}
                        color="error"
                        onClick={handleClose}
                    >
                        <CloseIcon/>
                    </Button>
                </Header>
                <FormContainer>
                    {
                        formFields.map((formItem, index) => {
                            if(Array.isArray(formItem)){
                                return <InputContainer isRow={true}>
                                {
                                    formItem.map((innerFormItem, iindex) => {
                                        return getInput(innerFormItem, formTitle, `${index}-${iindex}`, true)
                                    })
                                }
                                </InputContainer>
                            }
                            return getInput(formItem, formTitle, index)
                        })
                    }
                </FormContainer>
                <ButtonContainer>
                    {
                        isLoading ? 
                        <CircularProgress
                            size={'2.28rem'}/> :
                        <Button
                            onClick={handleSubmitClick}
                            variant="contained">
                            Submit
                        </Button>
                    }
                </ButtonContainer>
            </Container>
        </Modal>
    </>
}