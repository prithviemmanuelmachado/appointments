import { useParams } from "react-router-dom";
import { Card, Container } from "./index.style";
import { useState } from "react";
import Input from "../../components/input";
import { inputTypes } from "../../constants";
import { Button } from "@mui/material";
import ApiService from "../../services/apiservice";
import {useDispatch} from "react-redux";
import { updateToast } from "../../store/toastSlice";

export default function ResetPassword(props){
    const {
        navigate
    } = props;

    const {
        uid,
        token
    } = useParams();

    const dispatch = useDispatch();

    const [input, setInput] = useState({
        password: null,
        confirmPassword: null,
        token: token
    });

    const [error, setError] = useState({
        password: null,
        confirmPassword: null,
        token: null
    })

    const form = {
        password: {
            label: 'Enter new password',
            type: inputTypes.password,
            value: input.password,
            setValue: (event) =>  {
                setInput({
                    ...input,
                    password: event.target.value
                })
            },
            error: error.password
        },
        confirmPassword: {
            label: 'Confirm password',
            type: inputTypes.password,
            value: input.confirmPassword,
            setValue: (event) =>  {
                setInput({
                    ...input,
                    confirmPassword: event.target.value
                })
            },
            error: error.confirmPassword
        },
        token: {
            label: 'Token',
            type: inputTypes.text,
            value: input.token,
            setValue: (event) =>  {
                setInput({
                    ...input,
                    token: event.target.value
                })
            },
            error: error.token
        }
    }

    const resetPassword = () =>{
        let noError = true;
        let pError = null;
        let cError = null;
        let tError = null;

        if (!input.password) {
            pError = 'Enter a password';
            noError = false;
        } else if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(input.password)){
            pError = 'Password should be atleast 8 characters, with alteast 1 upper case letter, 1 lower case letter, 1 number and one of these special characters ! @ # $ % ^ & *';
            noError = false;
        }

        if(!input.confirmPassword){
            cError = 'Enter a password';
            noError = false;
        } else if (input.password !== input.confirmPassword){
            cError = 'Does not match entered password';
            noError = false;
        }

        if(!input.token){
            tError = 'Enter the token you recived';
            noError = false;
        }

        setError({
            password: pError,
            confirmPassword: cError,
            token: tError
        })

        if(noError){
            ApiService.post(
                '/auth/users/reset_password_confirm/',
                {
                    uid: uid,
                    token: input.token,
                    new_password: input.password
                }
            )
            .then((res) => {
                dispatch(updateToast({
                    bodyMessage : 'Password has been reset successfully',
                    isVisible : true,
                    type: 'success'
                }))
                navigate('/');
            })
            .catch((err) => {
                let errorMessage = 'Unable to reset password';
                if(err?.response?.data){
                    errorMessage = ''
                    Object.keys(err.response.data).map((key) => {
                        errorMessage += `${key.toUpperCase()}: ${err.response.data[key].join(', ')}`
                    })
                }
                dispatch(updateToast({
                    bodyMessage : errorMessage,
                    isVisible : true,
                    type: 'error'
                }))
            })
        }
    }

    return <Container>
        <Card>
            <Input inputDetails={form.password}/>
            <Input inputDetails={form.confirmPassword}/>
            <Input inputDetails={form.token}/>
            <Button
                onClick={resetPassword}
                variant="contained">
                Reset password
            </Button>
        </Card>
    </Container>
}