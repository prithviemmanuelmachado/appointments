import { 
    Button, 
    CircularProgress, 
    IconButton, 
    Modal
} from "@mui/material"
import { Component, useState } from "react";
import { 
    Container,
    Title,
    TitleContainer,
    FormContainer,
    ButtonContainer,
    Header,
    InputContainer,
} from "./index.style";
import CloseIcon from '@mui/icons-material/Close';
import Input from "../input";

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

    const getInput = (formItem, formTitle, index, noPadding = false) => {
        return <InputContainer key={`form-${formTitle}-${index}`} width={formItem.width} noPadding={noPadding}>
        <Input inputDetails={formItem}/>
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
                    <IconButton 
                        aria-label="close"
                        style={{
                            flexGrow: 1
                        }}
                        color="error"
                        onClick={handleClose}
                    >
                        <CloseIcon/>
                    </IconButton>
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