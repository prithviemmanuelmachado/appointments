import { Container, Left, PageLink, Profile, Right, Title } from "./index.style";
import ModalForm from '../../components/modal-form';
import { inputTypes } from '../../constants';
import { useState } from "react";
import { Button } from "@mui/material";
import ApiService from "../../services/apiservice";
import { useDispatch, useSelector } from 'react-redux';
import { updateToast } from '../../store/toastSlice';
import { clearProfile, updateProfile } from "../../store/profileSlice";
import { Link } from 'react-router';

export default function NavBar(props){
    const {
        navigate
    } = props;
    const profile = useSelector(state => state.profile);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    const [usernameError, setUsernameError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState(null);
    const [firstNameError, setFirstNameError] = useState(null);
    const [lastNameError, setLastNameError] = useState(null);
    const [emailError, setEmailError] = useState(null)

    const dispatch = useDispatch();

    const handleLogout = () => {
        sessionStorage.removeItem('access');
        sessionStorage.removeItem('refresh');
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('firstName');
        sessionStorage.removeItem('lastName');
        sessionStorage.removeItem('isStaff');
        dispatch(clearProfile());
        navigate('/', { replace: true });
    }

    const resetField = () => {
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setFirstName('');
        setLastName('');
        setEmail('');
    }

    const resetErrors = () => {
        setUsernameError(null);
        setPasswordError(null);
        setConfirmPasswordError(null);
        setFirstNameError(null);
        setLastNameError(null);
        setEmailError(null);
    }

    const getProfile = () => {
        return new Promise((resolve, reject) => {
            ApiService.get(
                'auth/users/me/'
            )
            .then((res) => {
                sessionStorage.setItem('email', res.data.email);
                sessionStorage.setItem('firstName', res.data.first_name);
                sessionStorage.setItem('lastName', res.data.last_name);
                sessionStorage.setItem('isStaff', res.data.is_staff);

                dispatch(updateProfile({
                    email: res.data.email,
                    firstName: res.data.first_name,
                    lastName: res.data.last_name,
                    isStaff: res.data.is_staff
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
    
            if (username === '') {
                setUsernameError('Enter a username');
                noError = false;
            } else {
                setUsernameError(null);
            }
    
            if (password === '') {
                setPasswordError('Enter a password');
                noError = false;
            } else {
                setPasswordError(null);
            }
    
            if (noError) {
                ApiService.post(
                    'auth/jwt/create/',
                    {
                        username: username,
                        password: password,
                    }
                )
                .then((res) => {
                    sessionStorage.setItem('access', res.data.access);
                    sessionStorage.setItem('refresh', res.data.refresh);

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
        });
    };

    const signup = () => {
        return new Promise((resolve, reject) => {
            let noError = true;
    
            if (username === '') {
                setUsernameError('Enter a username');
                noError = false;
            } else if (!/^.{6,}$/.test(username)){
                setUsernameError('Username should be atleast 6 characters');
                noError = false;
            } else {
                setUsernameError(null);
            }
    
            if (password === '') {
                setPasswordError('Enter a password');
                noError = false;
            } else if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)){
                setPasswordError('Password should be atleast 8 characters, with alteast 1 upper case letter, 1 lower case letter, 1 number and one of these special characters ! @ # $ % ^ & *');
                noError = false;
            } else {
                setPasswordError(null);
            }

            if(confirmPassword === ''){
                setConfirmPasswordError('Enter a password');
                noError = false;
            } else if (password !== confirmPassword){
                setConfirmPasswordError('Does not match entered password');
                noError = false;
            } else {
                setConfirmPasswordError(null);
            }

            if(email === ''){
                setEmailError('Enter an email');
                noError = false;
            } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)){
                setEmailError('Please enter a valid email');
                noError = false;
            } else {
                setEmailError(null);
            }

            if(firstName === ''){
                setFirstNameError('Enter first name');
                noError = false;
            } else {
                setFirstNameError(null);
            }

            if(lastName === ''){
                setLastNameError('Enter first name');
                noError = false;
            } else {
                setLastNameError(null);
            }
    
            if (noError) {
                ApiService.post(
                    'auth/users/',
                    {
                        username: username,
                        password: password,
                        first_name: firstName,
                        last_name: lastName,
                        email: email 
                    }
                )
                .then((res) => {
                    dispatch(updateToast({
                        bodyMessage : 'Access request submitted. Administrators will review your request.',
                        isVisible : true,
                        type: 'success'
                    }))
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
        });
    }

    const loginForm = [
        {
            label: 'Enter username',
            type: inputTypes.text,
            value: username,
            setValue: (event) =>  {
                setUsername(event.target.value)
            },
            error: usernameError
        },
        {
            label: 'Enter password',
            type: inputTypes.password,
            value: password,
            setValue: (event) =>  {
                setPassword(event.target.value)
            },
            error: passwordError
        }
    ]

    const signupForm = [
        {
            label: 'Enter username',
            type: inputTypes.text,
            value: username,
            setValue: (event) =>  {
                setUsername(event.target.value)
            },
            error: usernameError
        },
        {
            label: 'Enter password',
            type: inputTypes.password,
            value: password,
            setValue: (event) =>  {
                setPassword(event.target.value)
            },
            error: passwordError
        },
        {
            label: 'Confirm password',
            type: inputTypes.password,
            value: confirmPassword,
            setValue: (event) =>  {
                setConfirmPassword(event.target.value)
            },
            error: confirmPasswordError
        },
        {
            label: 'Enter email',
            type: inputTypes.text,
            value: email,
            setValue: (event) =>  {
                setEmail(event.target.value)
            },
            error: emailError
        },
        {
            label: 'Enter first name',
            type: inputTypes.text,
            value: firstName,
            setValue: (event) =>  {
                setFirstName(event.target.value)
            },
            error: firstNameError
        },
        {
            label: 'Enter last name',
            type: inputTypes.text,
            value: lastName,
            setValue: (event) =>  {
                setLastName(event.target.value)
            },
            error: lastNameError
        }
    ]

    return <Container>
        <Left>
            <Title>Appointments</Title>
        </Left>
        <Right>
            {
                profile.email ?
                <>
                    <Profile>{`Hi, ${profile.firstName} ${profile.lastName}`}</Profile>
                    <PageLink
                        to='/appointment-list'
                        variant="text"
                        component={Link}>
                        Appointments
                    </PageLink>
                    {
                        profile.isStaff &&
                        <PageLink
                            to='/user-management-list'
                            variant="text"
                            component={Link}>
                            User mangement
                        </PageLink>
                    }
                    <Button
                        variant="outlined"
                        onClick={handleLogout}>
                        LOGOUT
                    </Button>
                </>:
                <>
                    <ModalForm
                        buttonLabel={'Login'}
                        formTitle={'LOGIN'}
                        formFields={loginForm}
                        onFormClose={() => {
                            resetField();
                            resetErrors();
                        }}
                        onSubmit={login}/>
                    <ModalForm
                        buttonLabel={'Signup'}
                        formTitle={'SIGNUP'}
                        buttonVariant="outlined"
                        formFields={signupForm}
                        onFormClose={() => {
                            resetField();
                            resetErrors();
                        }}
                        onSubmit={signup}/>
                </>
            }
        </Right>
    </Container>
}