import { 
    Button, 
    CircularProgress, 
    IconButton, 
    Link, 
    Modal
} from "@mui/material"
import { Component, useEffect, useState } from "react";
import { 
    Container,
    Title,
    TitleContainer,
    FormContainer,
    ButtonContainer,
    Header,
    InputContainer,
    LinkContainer,
} from "./index.style";
import CloseIcon from '@mui/icons-material/Close';
import Input from "../input";
import { inputTypes } from "../../constants";

/**
 * A reusable modal form component built with Material-UI.
 * This component dynamically renders form fields based on the provided configuration.
 * 
 * @component
 *
 * @param {Object} props - The properties for the ModalForm component.
 * @param {function} onFooterClick - The function that is called when footer link is clicked
 * @param {string} footerLinkText - The text on the footer link
 * @param {Component} props.buttonIcon - The icon for the button that opens the modal.
 * @param {string} props.buttonLabel - The label for the button that opens the modal.
 * @param {string} props.buttonVariant - The variant for the button that opens the modal. Same as the variant for MIUI Button.
 * @param {string} props.buttonColor - The color for the button that opens the modal. Same as the color for MIUI Button.
 * @param {string} props.formTitle - The title displayed at the top of the modal.
 * @param {Array<Object>} props.formFields - Array of form field configurations.
 * @param {string} props.formFields[].label - Label for the input field.
 * @param {string} props.formFields[].type - Type of input field (refer inputTypes in constants).
 * @param {string} [props.formFields[].error] - Error message for the input field.
 * @param {Array<Object>} [props.formFields[].options] - Options for inputTypes.choice and inputTypes.select input types.
 * @param {function} [props.onFormOpen] - Callback triggered when the modal is opened.
 * @param {function} [props.onFormClose] - Callback triggered when the modal is closed.
 * @param {function} [props.onSubmit] - Promise triggered when the form is submitted.
 * @param {boolean} [props.forceClose] - Set to true if parent wants to force close Modal form
 * @param {boolean} [props.forceOpen] - Set to true if parent wants to force open Modal form
 * 
 * @example
 * 
 * 
 *   const formFields = [
 *     {
 *       label: "Text Input",
 *       type: inputTypes.text,
 *       key: 'textInput'
 *       error: ""
 *     },
 *     {
 *       label: "Select Input",
 *       type: inputTypes.select,
 *       key: 'selectInput',
 *       options: [
 *         { label: "Option 1", value: "option1" },
 *         { label: "Option 2", value: "option2" }
 *       ],
 *       error: ""
 *     },
 *      [ //for multiple inputs in sthe same line
 *            {
 *                width: '40%',
 *                error: false,
 *                type: inputTypes.select,
 *                key: 'dateLookup',
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
 *                key: 'date'
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
 *       onSubmit={(data) => {new Promise(resolve, reject) => resolve(console.log(("Form submitted")})}
 *     />\
 * 
 * @returns {JSX.Element} A `Modal` commponent.
 * 
 */
export default function ModalForm(props){
    const {
        onFooterClick,
        footerLinkText,
        buttonIcon,
        buttonLabel,
        buttonVariant,
        buttonColor,
        formTitle,
        formFields,
        onFormOpen,
        onFormClose,
        onSubmit,
        forceClose,
        forceOpen
    } = props;

    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({});

    const handleClose = () => {
        if(onFormClose){
            onFormClose();
        }
        setVisible(false);
        constructForm();
    }

    const handleSubmitClick = () => {
        setIsLoading(true);
        onSubmit(form)
        .then(() => {
            setIsLoading(false);
            handleClose();
        })
        .catch(() => setIsLoading(false));
    }

    useEffect(() => {
        if(forceClose === true){
            handleClose();
        }
    }, [forceClose])

    useEffect(() => {
        if(forceOpen === true){
            setVisible(true);
        }
    }, [forceOpen])

    const getInput = (formItem, formTitle, index, noPadding = false) => {
        return <InputContainer key={`form-${formTitle}-${index}`} width={formItem.width} noPadding={noPadding}>
        <Input inputDetails={{
            ...formItem,
            value: form[formItem.key],
            setValue: (e) => setForm((prevState) => {
                const temp = {...prevState}
                temp[formItem.key] = formItem.type === inputTypes.time ||
                                     formItem.type === inputTypes.date ||
                                     formItem.type === inputTypes.image ? e : e.target.value
                return temp;
            })
        }}/>
        </InputContainer>
    }

    useEffect(() => {
        constructForm();
    }, [])

    const constructForm = () => {
        //construct form input
        let temp = {};
        formFields.forEach((formItem) => {
            if(Array.isArray(formItem)){
                formItem.forEach((innerFormItem) => {
                    temp[innerFormItem.key] = innerFormItem.default ?? null;
                })
            }
            else{
                temp[formItem.key] = formItem.default ?? null;
            }
        })
        setForm({...temp});
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
                    <LinkContainer>
                        {
                            footerLinkText &&
                            onFooterClick &&
                            <Link
                            underline="none"
                            component="button"
                            onClick={onFooterClick}>
                            {footerLinkText}
                            </Link>
                        }
                    </LinkContainer>
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