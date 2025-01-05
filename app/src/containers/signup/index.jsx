import { useState } from "react";
import { useDispatch } from "react-redux";
import { inputTypes } from "../../constants";
import ApiService from "../../services/apiservice";
import { updateToast } from "../../store/toastSlice";
import ModalForm from "../../components/modal-form";

export default function Signup(props){
    const dispatch = useDispatch();

    const [input, setInput] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        avatar: null
    });

    const [error, setError] = useState({
        username: null,
        firstName: null,
        lastName: null,
        email: null
    });

    const signupForm = [
        {
            label: 'Enter username',
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
        {
            label: 'Enter email',
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
        {
            label: 'Enter first name',
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
        {
            label: 'Enter last name',
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
        {
            label: 'avatar',
            type: inputTypes.image,
            value: input.avatar,
            setValue: (file) =>  {
                setInput({
                    ...input,
                    avatar: file
                })
            },
            error: null
        }
    ];

    const resetField = () => {
        setInput({
            username: '',
            firstName: '',
            lastName: '',
            email: '',
            avatar: null
        });
    }

    const resetErrors = () => {
        setError({
            username: null,
            firstName: null,
            lastName: null,
            email: null
        });
    }

    const signup = () => {
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
                ApiService.post(
                    'auth/users/',
                    {
                        username: input.username,
                        first_name: input.firstName,
                        last_name: input.lastName,
                        email: input.email 
                    }
                )
                .then((res) => {
                    console.log(res.data)
                    const form = new FormData();
                    form.append('avatar', input.avatar);
                    ApiService.post(
                        `users/${res.data.id}/avatars/`,
                        form,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        }
                    ).then((ires) => {
                        dispatch(updateToast({
                            bodyMessage : 'Access request submitted. Administrators will review your request.',
                            isVisible : true,
                            type: 'success'
                        }))
                        resolve(res.data);
                    })
                    .catch((err) => {
                        dispatch(updateToast({
                            bodyMessage : 'Access request submitted, but failed to add your avatar. Administrators will review your request.',
                            isVisible : true,
                            type: 'success'
                        }))
                        resolve(res.data);
                    })
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

    return <ModalForm
    buttonLabel={'Signup'}
    formTitle={'SIGNUP'}
    buttonVariant="outlined"
    formFields={signupForm}
    onFormClose={() => {
        resetField();
        resetErrors();
    }}
    onSubmit={signup}/>
}