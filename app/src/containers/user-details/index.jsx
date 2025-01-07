import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ApiService from "../../services/apiservice";
import { updateToast } from "../../store/toastSlice";
import { useDispatch } from "react-redux";
import { CustomAvatar, Data, DataContainer, Label, LabelContainer, Row } from "./index.style";
import { Button } from "@mui/material";
import ModalForm from "../../components/modal-form";
import { inputTypes } from "../../constants";

export default function UserDetails(props){
    const { id } = props;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [data, setData] = useState({});

    const [createdUsername, setCreatedUsername] = useState(data.username);
    const [createdFirstName, setCreatedFirstName] = useState(data.first_name);
    const [createdLastName, setCreatedLastName] = useState(data.last_name);
    const [createdEmail, setCreatedEmail] = useState(data.email);
    const [createRole, setCreateRole] = useState(data.is_staff);
    const [createIsActive, setCreateIsActive] = useState(data.is_active);

    const [usernameError, setUsernameError] = useState(null);
    const [firstNameError, setFirstNameError] = useState(null);
    const [lastNameError, setLastNameError] = useState(null);
    const [emailError, setEmailError] = useState(null);

    const editForm = [
        {
            label: 'Enter username',
            type: inputTypes.text,
            value: createdUsername,
            setValue: (event) =>  {
                setCreatedUsername(event.target.value)
            },
            error: usernameError
        },
        {
            label: 'Enter email',
            type: inputTypes.text,
            value: createdEmail,
            setValue: (event) =>  {
                setCreatedEmail(event.target.value)
            },
            error: emailError
        },
        {
            label: 'Enter first name',
            type: inputTypes.text,
            value: createdFirstName,
            setValue: (event) =>  {
                setCreatedFirstName(event.target.value)
            },
            error: firstNameError
        },
        {
            label: 'Enter last name',
            type: inputTypes.text,
            value: createdLastName,
            setValue: (event) =>  {
                setCreatedLastName(event.target.value)
            },
            error: lastNameError
        },
        {
            label: 'Select role',
            type: inputTypes.select,
            error: false,
            value: createRole,
            setValue: (event) =>  {
                setCreateRole(event.target.value)
            },
            options: [
                {
                  label: 'Doctor',
                  value: false
                },
                {
                  label: 'Administrator',
                  value: true
                }
            ]  
        },
        {
            label: 'Select status',
            type: inputTypes.select,
            error: false,
            value: createIsActive,
            setValue: (event) =>  {
                setCreateIsActive(event.target.value)
            },
            options: [
                {
                  label: 'Inactive',
                  value: false
                },
                {
                  label: 'Active',
                  value: true
                }
            ]  
        }
    ];

    const resetField = () => {
        setCreatedUsername(data.username);
        setCreatedFirstName(data.first_name);
        setCreatedLastName(data.last_name);
        setCreatedEmail(data.email);
        setCreateRole(data.is_staff);
        setCreateIsActive(data.is_active);
    }

    const resetErrors = () => {
        setUsernameError(null);
        setFirstNameError(null);
        setLastNameError(null);
        setEmailError(null);
    }

    useEffect(() => {
        getDetails();
    }, []);

    useEffect(() => {
        resetField();
    }, [data]);

    const getDetails = () => {
        ApiService.get(
            `auth/users/${id}/`
        )
        .then((res) => {
            setData(res.data);
        })
        .catch((err) => {
            if(err.status === 404){
                dispatch(updateToast({
                    bodyMessage : 'No such user exists',
                    isVisible : true,
                    type: 'error'
                }))
            }
            dispatch(updateToast({
                bodyMessage : err.response.data,
                isVisible : true,
                type: 'error'
            }))
        })
    }

    const editUser = () => {
        return new Promise((resolve, reject) => {
            let noError = true;
    
            if (createdUsername === '') {
                setUsernameError('Enter a username');
                noError = false;
            } else if (!/^.{6,}$/.test(createdUsername)){
                setUsernameError('Username should be atleast 6 characters');
                noError = false;
            } else {
                setUsernameError(null);
            }

            if(createdEmail === ''){
                setEmailError('Enter an email');
                noError = false;
            } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(createdEmail)){
                setEmailError('Please enter a valid email');
                noError = false;
            } else {
                setEmailError(null);
            }

            if(createdFirstName === ''){
                setFirstNameError('Enter first name');
                noError = false;
            } else {
                setFirstNameError(null);
            }

            if(createdLastName === ''){
                setLastNameError('Enter first name');
                noError = false;
            } else {
                setLastNameError(null);
            }
    
            if (noError) {
                ApiService.put(
                    `auth/users/${id}/`,
                    {
                        username: createdUsername,
                        first_name: createdFirstName,
                        last_name: createdLastName,
                        email: createdEmail,
                        is_staff: createRole,
                        is_active: createIsActive
                    }
                )
                .then((res) => {
                    dispatch(updateToast({
                        bodyMessage : 'User updated successfully.',
                        isVisible : true,
                        type: 'success'
                    }))
                    if(createIsActive && !data.is_already_activated){
                        ApiService.post(
                            `auth/users/reset_password/`,
                            {
                                "email": createdEmail
                            }                            
                        )
                    }
                    getDetails();
                    resolve(res.data);
                })
                .catch((err) => {
                    dispatch(updateToast({
                        bodyMessage : err.response.data,
                        isVisible : true,
                        type: 'error'
                    }))
                    reject(err);
                });
            }
            else{
                reject({
                    error: 'Validation error'
                })
            }
        });
    }

    const deleteUser = () => {
        ApiService.delete(
            `users/${id}/`
        )
        .then((res) => {
            dispatch(updateToast({
                bodyMessage : 'User deleted successfully',
                isVisible : true,
                type: 'success'
            }))
            navigate('/user-management-list');
        })
        .catch((err) => {
            if(err.status === 404){
                dispatch(updateToast({
                    bodyMessage : 'No such user exists',
                    isVisible : true,
                    type: 'error'
                }))
            }
            dispatch(updateToast({
                bodyMessage : err.response.data,
                isVisible : true,
                type: 'error'
            }))
        })
    }
    
    return <>
        <Row>
            <Button
                onClick={deleteUser}
                variant="contained"
                color="error">
                Delete
            </Button>
            <ModalForm
                buttonLabel={'Edit user'}
                formTitle={'Edit user'}
                buttonVariant="contained"
                formFields={editForm}
                onFormClose={() => {
                    resetField();
                    resetErrors();
                }}
                onSubmit={editUser}/>
        </Row>
        <Row>
            <LabelContainer>
                <Label>
                    Username
                </Label>
            </LabelContainer>
            <DataContainer>
                <Data>
                    {data.username ?? '---'}
                </Data>
            </DataContainer>
        </Row>
        <Row>
            <LabelContainer>
                <Label>
                    Email
                </Label>
            </LabelContainer>
            <DataContainer>
                <Data>
                    {data.email ?? '---'}
                </Data>
            </DataContainer>
        </Row>
        <Row>
            <LabelContainer>
                <Label>
                    First name
                </Label>
            </LabelContainer>
            <DataContainer>
                <Data>
                    {data.first_name ?? '---'}
                </Data>
            </DataContainer>
        </Row>
        <Row>
            <LabelContainer>
                <Label>
                    Last name
                </Label>
            </LabelContainer>
            <DataContainer>
                <Data>
                    {data.last_name ?? '---'}
                </Data>
            </DataContainer>
        </Row>
        <Row>
            <LabelContainer>
                <Label>
                    Avatar
                </Label>
            </LabelContainer>
            <DataContainer>
                <Data>
                    {
                        data.avatar ?
                        <CustomAvatar src={data.avatar.avatar} /> :
                        data.first_name && <CustomAvatar sizes="10rem">{data.first_name[0]}</CustomAvatar>
                    }
                </Data>
            </DataContainer>
        </Row>
        <Row>
            <LabelContainer>
                <Label>
                    Status
                </Label>
            </LabelContainer>
            <DataContainer>
                <Data>
                    {
                        data.is_active === null || data.is_active === undefined ? 
                            '---' :
                            data.is_active ?
                                'Active' : 
                                'Inactive'
                    }
                </Data>
            </DataContainer>
        </Row>
        <Row>
            <LabelContainer>
                <Label>
                    Role
                </Label>
            </LabelContainer>
            <DataContainer>
                <Data>
                    {
                        data.is_staff === null || data.is_active === undefined ? 
                        '---' : 
                        data.is_staff ? 
                            'Administrator' : 
                            'Doctor'
                    }
                </Data>
            </DataContainer>
        </Row>
    </>
}