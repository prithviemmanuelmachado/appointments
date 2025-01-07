import { useState } from "react";
import { useDispatch } from "react-redux";
import { inputTypes } from "../../constants";
import ApiService from "../../services/apiservice";
import { updateToast } from "../../store/toastSlice";
import ModalForm from "../../components/modal-form";

export default function Signup(props){
    const dispatch = useDispatch();

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
            key: 'username',
            error: error.username
        },
        {
            label: 'Enter email',
            type: inputTypes.text,
            key: 'email',
            error: error.email
        },
        {
            label: 'Enter first name',
            type: inputTypes.text,
            key: 'firstName',
            error: error.firstName
        },
        {
            label: 'Enter last name',
            type: inputTypes.text,
            key: 'lastName',
            error: error.lastName
        },
        {
            label: 'avatar',
            type: inputTypes.image,
            key: 'avatar',
            error: null
        }
    ];

    const resetErrors = () => {
        setError({
            username: null,
            firstName: null,
            lastName: null,
            email: null
        });
    }

    const signup = (data) => {
        return new Promise((resolve, reject) => {
            let noError = true;
            let uError = null;
            let eError = null;
            let fError = null;
            let lError = null;
    
            if (!data.username) {
                uError = 'Enter a username';
                noError = false;
            } else if (!/^.{6,}$/.test(data.username)){
                uError = 'Username should be atleast 6 characters';
                noError = false;
            }

            if(!data.email){
                eError = 'Enter an email';
                noError = false;
            } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email)){
                eError = 'Please enter a valid email';
                noError = false;
            }

            if(!data.firstName){
                fError = 'Enter first name';
                noError = false;
            }

            if(!data.lastName){
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
                        username: data.username,
                        first_name: data.firstName,
                        last_name: data.lastName,
                        email: data.email 
                    }
                )
                .then((res) => {
                    const form = new FormData();
                    form.append('avatar', data.avatar);
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
        resetErrors();
    }}
    onSubmit={signup}/>
}