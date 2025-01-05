import { useState } from "react";
import { useDispatch } from "react-redux";
import { inputTypes } from "../../constants";
import ApiService from "../../services/apiservice";
import { updateProfile } from "../../store/profileSlice";
import { updateToast } from "../../store/toastSlice";
import ModalForm from "../../components/modal-form";

export default function Login(props){
    const dispatch = useDispatch();

    const [input, setInput] = useState({
        username: '',
        password: ''
    });

    const [error, setError] = useState({
        username: null,
        password: null
    });

    const loginForm = [
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
            label: 'Enter password',
            type: inputTypes.password,
            value: input.password,
            setValue: (event) =>  {
                setInput({
                    ...input,
                    password: event.target.value
                })
            },
            error: error.password
        }
    ];

    const resetField = () => {
        setInput({
            username: '',
            password: ''
        })
    }

    const resetErrors = () => {
        setError({
            username: null,
            password: null
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
                dispatch(updateToast({
                    bodyMessage : err.response.data,
                    isVisible : true,
                    type: 'error'
                }));
                reject(err);
            });
        });
    }

    const login = () => {
        return new Promise((resolve, reject) => {
            let noError = true;
            let uError = null;
            let pError = null;
    
            if (input.username === '') {
                uError = 'Enter a username';
                noError = false;
            }
    
            if (input.password === '') {
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
                        username: input.username,
                        password: input.password,
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

    return <ModalForm
                buttonLabel={'Login'}
                formTitle={'LOGIN'}
                formFields={loginForm}
                onFormClose={() => {
                    resetField();
                    resetErrors();
                }}
                onSubmit={login}/>
}