import { useEffect, useState } from "react";
import ApiService from "../../services/apiservice";
import { raiseError, updateToast } from "../../store/toastSlice";
import { useDispatch } from "react-redux";
import { Data, DataContainer, Label, LabelContainer, Row, Title } from "./index.style";
import { Button, CircularProgress, IconButton } from "@mui/material";
import { avatarSize, chipVariant, inputTypes } from "../../constants";
import { useDrawer } from "../../providers/details-drawer";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CloseIcon from '@mui/icons-material/Close';
import Avatar from "../../components/avatar";
import Chip from "../../components/chip";
import Input from "../../components/input";

export default function UserDetails(props){
    const { id } = props;
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const {closeDrawer} = useDrawer();
    const queryClient = useQueryClient();

    const [input, setInput] = useState({
        username: null,
        firstName: null,
        lastName: null,
        email: null,
        role: null,
        isActive: null,
        avatar: null
    })

    const [error, setError] = useState({
        username: null,
        firstName: null,
        lastName: null,
        email: null
    })

    const editForm = {
        username: {
            type: inputTypes.text,
            value: input.username,
            setValue: (event) =>  {
                setInput({
                    ...input,
                    username: event.target.value
                })
            },
            error: error.username
        },
        email: {
            type: inputTypes.text,
            value: input.email,
            setValue: (event) =>  {
                setInput({
                    ...input,
                    email: event.target.value
                })
            },
            error: error.email
        },
        firstName: {
            type: inputTypes.text,
            value: input.firstName,
            setValue: (event) =>  {
                setInput({
                    ...input,
                    firstName: event.target.value
                })
            },
            error: error.firstName
        },
        lastName: {
            type: inputTypes.text,
            value: input.lastName,
            setValue: (event) =>  {
                setInput({
                    ...input,
                    lastName: event.target.value
                })
            },
            error: error.lastName
        },
        role: {
            type: inputTypes.select,
            value: input.role,
            setValue: (event) =>  {
                setInput({
                    ...input,
                    role: event.target.value
                })
            },
            error: false,
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
        isActive: {
            type: inputTypes.select,
            value: input.isActive,
            setValue: (event) =>  {
                setInput({
                    ...input,
                    isActive: event.target.value
                })
            },
            error: false,
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
        },
        avatar: {
            label: 'avatar',
            type: inputTypes.image,
            value: input.avatar,
            setValue: (file) =>  {
                setInput({
                    ...input,
                    avatar: file
                })
            },
        }
    };

    const fetchDetails = () => {
        return ApiService.get(
            `auth/users/${id}/`
        )
    }

    const { data: userDetails, isLoading: userIsLoading, isError: userIsError, error: userError } = useQuery({
        queryKey: ['user-details', id],
        queryFn: fetchDetails,
        enabled: !!id,
        staleTime: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        cacheTime: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        select: (res) => {
            return res.data
        }
    });

    useEffect(() => {
        if(userIsError){
            dispatch(raiseError({
                error: userError.response?.data ?? null,
                status: userError.status
            }))
        }
    }, [userIsError])

    const resetField = () => {
        setInput({
            username: userDetails.username,
            firstName: userDetails.first_name,
            lastName: userDetails.last_name,
            email: userDetails.email,
            role: userDetails.is_staff,
            isActive: userDetails.is_active,
            avatar: userDetails.avatar?.avatar ?? null
        })
    }

    const resetErrors = () => {
        setError({
            username: null,
            firstName: null,
            lastName: null,
            email: null
        })
    }

    useEffect(() => {
        if(!userIsLoading && !!id){
            resetField();
            resetErrors();
        }
    }, [userDetails]);

    const callAvatar = () => {
        const form = new FormData();
        form.append('avatar', input.avatar);
        if(userDetails.avatar){
            return ApiService.put(
                `users/${id}/avatars/${id}`,
                form,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            )
        }
        else{
            return ApiService.post(
                `users/${id}/avatars/`,
                form,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            )
        }
    }

    const editUser = () => {
        return new Promise((resolve, reject) => {
            let noError = true;
            let uError = null;
            let eError = null;
            let fError = null;
            let lError = null;
    
            if (!input.username) {
                uError = 'Enter a username';
                noError = false;
            } else if (!/^.{6,}$/.test(input.username)){
                uError = 'Username should be atleast 6 characters';
                noError = false;
            }

            if(!input.email){
                eError = 'Enter an email';
                noError = false;
            } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(input.email)){
                eError = 'Please enter a valid email';
                noError = false;
            }

            if(!input.firstName){
                fError = 'Enter first name';
                noError = false;
            }

            if(!input.lastName){
                lError = 'Enter first name';
                noError = false;
            }

            setError({
                username: uError,
                lastName: lError,
                firstName: fError,
                email: eError
            })
    
            if (noError) {
                ApiService.put(
                    `auth/users/${id}/`,
                    {
                        username: input.username,
                        first_name: input.firstName,
                        last_name: input.lastName,
                        email: input.email,
                        is_staff: input.role,
                        is_active: input.isActive
                    }
                )
                .then((res) => {
                    if(input.avatar instanceof File && input.avatar !== null){
                        callAvatar()                        
                        .then((ires) => {
                            dispatch(updateToast({
                                bodyMessage : 'User updated successfully.',
                                isVisible : true,
                                type: 'success'
                            }))
                            queryClient.invalidateQueries(['user-details', id]);
                            resolve(res.data);
                        })
                        .catch((err) => {
                            dispatch(updateToast({
                                bodyMessage : 'User updated successfully, but failed to add your avatar.',
                                isVisible : true,
                                type: 'success'
                            }))
                            queryClient.invalidateQueries(['user-details', id]);
                            resolve(res.data);
                        })
                    }
                    else{
                        dispatch(updateToast({
                            bodyMessage : 'User updated successfully.',
                            isVisible : true,
                            type: 'success'
                        }))
                        resolve(res.data)
                        queryClient.invalidateQueries(['user-details', id]);
                    }
                    
                    if(input.isActive && !userDetails.is_already_activated){
                        ApiService.post(
                            `auth/users/reset_password/`,
                            {
                                "email": input.email
                            }                            
                        )
                    }
                })
                .catch((err) => {
                    const error = err.response.data
                    dispatch(raiseError({
                        error: error ?? null,
                        status: err.status
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
            queryClient.invalidateQueries(['userData']);
            queryClient.invalidateQueries(['user-details', id]);
        })
        .catch((err) => {
            const error = err.response.data
            dispatch(raiseError({
                error: error ?? null,
                status: err.status
            }))
        })
    }
    
    return <>
        <Row
            sticky>
            <Title>#{id}</Title>
            {
                isEditing ? 
                <>
                    {
                        isLoading ?
                        <CircularProgress/> :
                        <Button
                            onClick={() => {
                                editUser()
                                .then(() => {
                                    setIsLoading(false);
                                    setIsEditing(false);
                                    queryClient.invalidateQueries(['userData']);
                                })
                                .catch(() => {
                                    setIsLoading(false);
                                })
                            }}
                            variant="contained">
                            Update
                        </Button>
                    }
                    <Button
                        onClick={() => {
                            setIsEditing(false);
                            resetField();
                        }}
                        variant="outlined">
                        Back
                    </Button>
                </>:
                <>
                    <Button
                        onClick={() => {setIsEditing(true)}}
                        variant="contained">
                        Edit
                    </Button>
                    <Button
                        onClick={deleteUser}
                        variant="outlined"
                        color="error">
                        Delete
                    </Button>
                </>
            }
            <IconButton 
                aria-label="close"
                color="error"
                onClick={closeDrawer}
            >
                <CloseIcon/>
            </IconButton>
        </Row>
        {
            userIsLoading ? 
            <CircularProgress/> :
            userDetails &&
            <>
                <Row>
                    <LabelContainer>
                        <Label>
                            Username
                        </Label>
                    </LabelContainer>
                    <DataContainer>
                        {
                            <Data>
                                {userDetails.username ?? '---'}
                            </Data>
                        }
                    </DataContainer>
                </Row>
                <Row>
                    <LabelContainer>
                        <Label>
                            Email
                        </Label>
                    </LabelContainer>
                    <DataContainer>
                        {
                            isEditing ?
                            <Input inputDetails={editForm.email}/> :
                            <Data>
                                {userDetails.email ?? '---'}
                            </Data>
                        }
                    </DataContainer>
                </Row>
                <Row>
                    <LabelContainer>
                        <Label>
                            First name
                        </Label>
                    </LabelContainer>
                    <DataContainer>
                        {
                            isEditing ?
                            <Input inputDetails={editForm.firstName}/> :
                            <Data>
                                {userDetails.first_name ?? '---'}
                            </Data>
                        }
                    </DataContainer>
                </Row>
                <Row>
                    <LabelContainer>
                        <Label>
                            Last name
                        </Label>
                    </LabelContainer>
                    <DataContainer>
                        {
                            isEditing ?
                            <Input inputDetails={editForm.lastName}/> :
                            <Data>
                                {userDetails.last_name ?? '---'}
                            </Data>
                        }
                    </DataContainer>
                </Row>
                <Row>
                    <LabelContainer top={!isEditing}>
                        <Label>
                            Avatar
                        </Label>
                    </LabelContainer>
                    <DataContainer top={!isEditing}>
                        {
                            isEditing ?
                            <Input inputDetails={editForm.avatar}/> :
                            <Data>
                                {
                                    <Avatar
                                    avatar={userDetails.avatar?.avatar ?? null}
                                    alt={userDetails.first_name[0]}
                                    size={avatarSize.l}/>
                                }
                            </Data>
                        }
                    </DataContainer>
                </Row>
                <Row>
                    <LabelContainer>
                        <Label>
                            Status
                        </Label>
                    </LabelContainer>
                    <DataContainer>
                        {
                            isEditing ?
                            <Input inputDetails={editForm.isActive}/> :
                            <Data>
                                {
                                    userDetails.is_active === null || userDetails.is_active === undefined ? 
                                        '---' :
                                        <Chip
                                            label={
                                                userDetails.is_active ?
                                                'Active' : 
                                                'Inactive'
                                            }
                                            variant={
                                                userDetails.is_active ? 
                                                chipVariant.active :
                                                chipVariant.inactive
                                            }/>
                                }
                            </Data>
                        }
                    </DataContainer>
                </Row>
                <Row>
                    <LabelContainer>
                        <Label>
                            Role
                        </Label>
                    </LabelContainer>
                    <DataContainer>
                        {
                            isEditing ?
                            <Input inputDetails={editForm.role}/> :
                            <Data>
                                {
                                    userDetails.is_staff === null || userDetails.is_active === undefined ? 
                                    '---' : 
                                    <Chip
                                        label={
                                            userDetails.is_staff ? 
                                            'Administrator' : 
                                            'Doctor'
                                        }
                                        variant={
                                            userDetails.is_staff ? 
                                            chipVariant.admin :
                                            chipVariant.doctor
                                        }/>
                                }
                            </Data>
                        }
                    </DataContainer>
                </Row>
            </>
        }
    </>
}