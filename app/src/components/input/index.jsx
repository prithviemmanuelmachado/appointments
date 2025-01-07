import { Button, FormControl, FormControlLabel, FormHelperText, MenuItem, Radio, RadioGroup, Select, TextField, Tooltip } from "@mui/material";
import PasswordInput from "../password-input";
import { ErrorHelperText, FileLabel, Label, Row } from "./index.style";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { inputTypes } from "../../constants";

/**
 * A reusable input field component built with Material-UI.
 * This component dynamically renders different types of input fields
 * (e.g., text, textarea, password, date, time, select, etc.) based on the provided configuration.
 * 
 * @component
 *
 * @param {Object} props - The properties for the Input component.
 * @param {Object} props.inputDetails - Configuration object for the input field.
 * @param {string} props.inputDetails.type - Type of the input field (refer inputTypes in constants).
 * @param {string} props.inputDetails.label - Label for the input field.
 * @param {any} props.inputDetails.value - Current value of the input field.
 * @param {function} props.inputDetails.setValue - Callback function to update the input field value.
 * @param {string} [props.inputDetails.error] - Error message for the input field.
 * @param {Array<Object>} [props.inputDetails.options] - Options for `choice` and `select` input types.
 * @param {string} [props.inputDetails.options[].label] - Label for each option (for select and radio inputs).
 * @param {any} [props.inputDetails.options[].value] - Value for each option (for select and radio inputs).
 * 
 * @example
 * 
 * const inputDetails = {
 *   type: inputTypes.text,
 *   label: "Enter Name",
 *   value: nameValue,
 *   setValue: (e) => setNameValue(e.target.value),
 *   error: "Name is required"
 * };
 * 
 * <Input inputDetails={inputDetails} />
 * 
 * @example
 * 
 * const selectInputDetails = {
 *   type: inputTypes.select,
 *   label: "Select Option",
 *   value: selectedValue,
 *   setValue: (e) => setSelectedValue(e.target.value),
 *   options: [
 *     { label: "Option 1", value: "option1" },
 *     { label: "Option 2", value: "option2" }
 *   ],
 *   error: ""
 * };
 * 
 * <Input inputDetails={selectInputDetails} />
 * 
 * @example
 * 
 * const fileInputDetails = {
 *   type: inputTypes.image,
 *   label: "Upload Image",
 *   value: selectedFile,
 *   setValue: (file) => setSelectedFile(file),
 *   error: ""
 * };
 * 
 * <Input inputDetails={fileInputDetails} />
 * 
 * @example
 * 
 * const dateTimeInputDetails = [
 *   {
 *     type: inputTypes.date,
 *     label: "Select Date",
 *     value: dateValue,
 *     setValue: (value) => setDateValue(value),
 *     error: ""
 *   },
 *   {
 *     type: inputTypes.time,
 *     label: "Select Time",
 *     value: timeValue,
 *     setValue: (value) => setTimeValue(value),
 *     error: ""
 *   }
 * ];
 * 
 * dateTimeInputDetails.map((details, index) => (
 *   <Input key={`input-${index}`} inputDetails={details} />
 * ));
 * 
 * @returns {JSX.Element} A dynamic input field based on the provided configuration.
 */
export default function Input(props){
    const {
        inputDetails
    } = props;

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

    return <>
        {
            (
                inputDetails.type === inputTypes.textArea ||
                inputDetails.type === inputTypes.choice ||
                inputDetails.type === inputTypes.select ||
                inputDetails.type === inputTypes.date ||
                inputDetails.type === inputTypes.time
            ) &&
            <Label>{inputDetails.label}</Label>
        }
        {
            inputDetails.type === inputTypes.text &&
            <TextField
                sx={{width: '96%'}}
                error = {inputDetails.error}
                value = {inputDetails.value}
                onChange={inputDetails.setValue}
                label={inputDetails.label} 
                helperText = {inputDetails.error}
                variant="outlined" />
        }
        {
            inputDetails.type === inputTypes.textArea &&
            <TextField
                sx={{width: '96%'}}
                multiline
                rows={5}
                variant='outlined'
                value={inputDetails.value}
                onChange={inputDetails.setValue}
                error={inputDetails.error}
                helperText={inputDetails.error}/>
        }
        {
            inputDetails.type === inputTypes.password &&
            <PasswordInput
                error = {inputDetails.error}
                value = {inputDetails.value}
                onChange={inputDetails.setValue}
                label={inputDetails.label} 
                helperText = {inputDetails.error}/>
        }
        {
            inputDetails.type === inputTypes.choice &&
            <FormControl>
                <RadioGroup
                    row
                    value={inputDetails.value}
                    onChange={inputDetails.setValue}>
                    {
                        inputDetails.options.map((option, index) => {
                            return <FormControlLabel
                            key={`radio-${index}-${option.value}`}
                            value={option.value}
                            control={<Radio />}
                            label={option.label}/>
                        })
                    }
                </RadioGroup>
                {
                    inputDetails.error &&
                    <ErrorHelperText>
                        {inputDetails.error}
                    </ErrorHelperText>
                }
            </FormControl>
        }
        {
            inputDetails.type === inputTypes.select &&
            <FormControl fullWidth error>
                <Select
                sx={{width: '96%'}}
                variant='outlined'
                error={inputDetails.error}
                value={inputDetails.value}
                onChange={inputDetails.setValue}
                >
                {
                    inputDetails.options.map((option, index) => {
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
                    inputDetails.error &&
                    <FormHelperText>{inputDetails.error}</FormHelperText>
                }
            </FormControl>
        }
        {
            inputDetails.type === inputTypes.date &&
            <FormControl>
                <DatePicker
                sx={{width: '96%'}}
                variant='outlined'
                error={inputDetails.error}
                value={inputDetails.value}
                format="DD MMM, YYYY"
                onChange={inputDetails.setValue}/>
                {
                    inputDetails.error &&
                    <ErrorHelperText>{inputDetails.error}</ErrorHelperText>
                }
            </FormControl>
        }
        {
            inputDetails.type === inputTypes.time &&
            <FormControl>
                <TimePicker
                sx={{width: '96%'}}
                variant='outlined'
                error={inputDetails.error}
                value={inputDetails.value}
                onChange={inputDetails.setValue}/>
                {
                    inputDetails.error &&
                    <ErrorHelperText>{inputDetails.error}</ErrorHelperText>
                }
            </FormControl>
        }
        {
            inputDetails.type === inputTypes.image &&
            <Row>
                <input
                    id={`image-select-${inputDetails.label}`}
                    type="file"
                    hidden
                    accept={'image/*'}
                    onChange={(e) => handleFileChange(e, inputDetails.setValue)}
                />
                <Button
                    onClick={() => openFileSelect(inputDetails.label)}
                    variant="outlined">
                    {`Select ${inputDetails.label}`}
                </Button>
                <FileLabel
                    isSelected = {inputDetails.value}>
                    {
                        inputDetails.value ? 
                        <Tooltip title={inputDetails.value.name}>
                            {inputDetails.value.name}
                        </Tooltip> :
                        '...'
                    }
                </FileLabel>
            </Row>
        }
    </>
}