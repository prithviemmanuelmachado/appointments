import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { inputTypes } from "../../constants";
import ApiService from "../../services/apiservice";
import { updateProfile } from "../../store/profileSlice";
import { raiseError, updateToast } from "../../store/toastSlice";
import ModalForm from "../../components/modal-form";

export default function Login(props){
    const dispatch = useDispatch();

    const [error, setError] = useState({
        username: null,
        password: null
    });
    const [forgotPassError, setForgotPassError] = useState({
        email: null
    });
    const [forceClose, setForceClose] = useState(false);
    const [forceOpen, setForceOpen] = useState(false);

    const loginForm = [
        {
            label: 'Enter username',
            type: inputTypes.text,
            key: 'username',
            error: error.username
        },
        {
            label: 'Enter password',
            type: inputTypes.password,
            key: 'password',
            error: error.password
        }
    ];

    const forgotPassForm = [
        {
            label: 'Enter email',
            type: inputTypes.text,
            key: 'email',
            error: forgotPassError.email
        }
    ];

    const resetErrors = () => {
        setError({
            username: null,
            password: null
        })
    }

    const resetForgotPassErrors = () => {
        setError({
            email: null
        })
    }

    const getProfile = () => {
        return new Promise((resolve, reject) => {
            ApiService.get(
                'auth/users/me/'
            )
            .then((res) => {
                localStorage.setItem('email', res.data.email);
                localStorage.setItem('firstName', res.data.first_name);
                localStorage.setItem('lastName', res.data.last_name);
                localStorage.setItem('isStaff', res.data.is_staff);
                localStorage.setItem('avatar', res.data.avatar.avatar);

                dispatch(updateProfile({
                    email: res.data.email,
                    firstName: res.data.first_name,
                    lastName: res.data.last_name,
                    isStaff: res.data.is_staff,
                    avatar: res.data.avatar.avatar
                }));

                resolve(res.data);
            })
            .catch((err) => {
                const error = err.response.data
                dispatch(raiseError({
                    error: error ?? null,
                    status: err.status
                }))
                reject(err);
            });
        });
    }

    const login = (data) => {
        return new Promise((resolve, reject) => {
            let noError = true;
            let uError = null;
            let pError = null;
    
            if (data.username === '') {
                uError = 'Enter a username';
                noError = false;
            }
    
            if (data.password === '') {
                pError = 'Enter a password';
                noError = false;
            }

            setError({
                username: uError,
                password: pError
            })
    
            if (noError) {
                ApiService.post(
                    'auth/jwt/create/',
                    {
                        username: data.username,
                        password: data.password,
                    }
                )
                .then((res) => {
                    localStorage.setItem('access', res.data.access);
                    localStorage.setItem('refresh', res.data.refresh);

                    getProfile()
                    .then((data) => {
                        resolve(data);
                    })
                    .catch((err) => {
                        reject(err);
                    });
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
    };

    const resetPassword = (data) => {
        return new Promise((resolve, reject) => {
            let noError = true;
            let eError = null;
    
            if(!data.email){
                eError = 'Enter an email';
                noError = false;
            } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email)){
                eError = 'Please enter a valid email';
                noError = false;
            }

            setForgotPassError({
                email: eError
            })
    
            if (noError) {
                ApiService.post(
                    '/auth/users/reset_password/',
                    {
                        email: data.email
                    }
                )
                .then((res) => {
                    dispatch(updateToast({
                        bodyMessage : 'Reset email sent to the registered user.',
                        isVisible : true,
                        type: 'success'
                    }))
                    resolve(data);
                })
                .catch((err) => {
                    let message = ''
                    if(err.response.data.detail){
                        message = err.response.data.detail
                    }
                    else{
                        message = err.response.data
                    }
                    dispatch(updateToast({
                        bodyMessage : message,
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
    };

    const openForgotPassword = () => {
        setForceClose(true);
        setForceOpen(true);
    }

    useEffect(() => {
        setForceClose(false);
    },[forceClose])

    useEffect(() => {
        setForceOpen(false);
    },[forceOpen])


    return <>
        <ModalForm
            onFooterClick={openForgotPassword}
            footerLinkText={'Forgot password'}
            buttonLabel={'Login'}
            formTitle={'LOGIN'}
            formFields={loginForm}
            onFormClose={() => {
                resetErrors();
            }}
            onSubmit={login}
            forceClose={forceClose}/>
        <ModalForm
            formTitle={'FORGOT PASSWORD'}
            formFields={forgotPassForm}
            onFormClose={() => {
                resetForgotPassErrors();
            }}
            onSubmit={resetPassword}
            forceOpen={forceOpen}/>
    </>
}