import { useEffect, useState } from "react";
import ApiService from "../../services/apiservice";
import { inputTypes } from "../../constants";
import PaginationTable from "../../components/table";
import { useDispatch } from "react-redux";
import { updateToast } from "../../store/toastSlice";
import ModalForm from "../../components/modal-form";
import { Container } from "./index.style";

export default function UserManagementList(props){
    const dispatch = useDispatch();

    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [id, setId] = useState('');
    const [isActive, setIsActive] = useState(null);
    const [isStaff, setIsStaff] = useState(null);
    
    const [createdUsername, setCreatedUsername] = useState('');
    const [createdPassword, setCreatedPassword] = useState('');
    const [createdConfirmPassword, setCreatedConfirmPassword] = useState('');
    const [createdFirstName, setCreatedFirstName] = useState('');
    const [createdLastName, setCreatedLastName] = useState('');
    const [createdEmail, setCreatedEmail] = useState('');
    const [createRole, setCreateRole] = useState(false);

    const [usernameError, setUsernameError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState(null);
    const [firstNameError, setFirstNameError] = useState(null);
    const [lastNameError, setLastNameError] = useState(null);
    const [emailError, setEmailError] = useState(null);

    const [page, setPage] = useState(0);
    const [sortList, setSortList] = useState([]);
    const [filter, setFilter] = useState(true);
    const [data, setData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    const createForm = [
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
            label: 'Enter password',
            type: inputTypes.password,
            value: createdPassword,
            setValue: (event) =>  {
                setCreatedPassword(event.target.value)
            },
            error: passwordError
        },
        {
            label: 'Confirm password',
            type: inputTypes.password,
            value: createdConfirmPassword,
            setValue: (event) =>  {
                setCreatedConfirmPassword(event.target.value)
            },
            error: confirmPasswordError
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
        }
    ];

    const header = {
        id: {
          label: '#',
          align: 'left',
          canSort: true,
          width: '10%',
          input: {
            type: inputTypes.text,
            value: id,
            setValue: (event) =>  setId(event.target.value)
          }
        },
        first_name : {
          label: 'First name',
          align: 'left',
          canSort: true,
          width: '15%',
          input: {
            type: inputTypes.text,
            value: firstName,
            setValue: (event) =>  setFirstName(event.target.value)
          }
        },
        last_name : {
            label: 'Last name',
            align: 'left',
            canSort: true,
            width: '15%',
            input: {
              type: inputTypes.text,
              value: lastName,
              setValue: (event) =>  setLastName(event.target.value)
            }
        },
        username : {
            label: 'Username',
            align: 'left',
            canSort: true,
            width: '20%',
            input: {
              type: inputTypes.text,
              value: username,
              setValue: (event) =>  setUsername(event.target.value)
            }
        },
        email : {
            label: 'Email',
            align: 'left',
            canSort: true,
            width: '20%',
            input: {
              type: inputTypes.text,
              value: email,
              setValue: (event) =>  setEmail(event.target.value)
            }
        },
        is_active : {
            label: 'State',
            align: 'right',
            width: '10%',
            input: {
              type: inputTypes.select,
              value: isActive,
              setValue: (event) =>  setIsActive(event.target.value),
              options: [
                {
                  label: 'Active',
                  value: true
                },
                {
                  label: 'Inactive',
                  value: false
                }
              ]      
            }
        },
        is_staff : {
            label: 'Role',
            align: 'right',
            width: '15%',
            input: {
              type: inputTypes.select,
              value: isStaff,
              setValue: (event) =>  setIsStaff(event.target.value),
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
            }
        },
    }
    
    const onSortAsc = (key) => {
        setSortList((prevSortList) => {
          let updatedList = [...prevSortList];
    
          // Check if the key exists in the array
          if (updatedList.includes(key)) {
            // Remove the key
            updatedList = updatedList.filter(item => item !== key);
          } else if (updatedList.includes(`-${key}`)) {
            // If `-key` exists, remove it and add `key`
            updatedList = updatedList.filter(item => item !== `-${key}`);
            updatedList.push(key);
          } else {
            // If key does not exist, add it
            updatedList.push(key);
          }
    
          return updatedList;
        });
    }
    
    const onSortDesc = (key) => {
        setSortList((prevSortList) => {
          let updatedList = [...prevSortList];
    
          // Check if the -key exists in the array
          if (updatedList.includes(`-${key}`)) {
            // Remove the key
            updatedList = updatedList.filter(item => item !== `-${key}`);
          } else if (updatedList.includes(key)) {
            // If `key` exists, remove it and add `-key`
            updatedList = updatedList.filter(item => item !== key);
            updatedList.push(`-${key}`);
          } else {
            // If key does not exist, add it
            updatedList.push(`-${key}`);
          }
    
          return updatedList;
        });
    }
    
    const resetFilters = () => {
        setFirstName('');
        setLastName('');
        setUsername('');
        setId('');
        setEmail('');
        setIsActive(null);
        setIsStaff(null);
        setPage(0);
        setTotalCount(0);
        setSortList([]);
    }

    const onClick = (data) => {
        console.log(data);
    }
    
    useEffect(() => {
        ApiService.get(
            'users/',
            {
                username: username,
                first_name: firstName,
                last_name: lastName,
                id: id,
                email: email,
                is_active: isActive,
                is_staff: isStaff,
                ordering: sortList.join(','),
                page: page + 1
            }
        )
        .then((res) => {
            setTotalCount(res.data.count);
            setData(res.data.results.map((data) => {
                return {
                    ...data,
                    is_active: data.is_active ? 'Active' : 'Inactive',
                    is_staff: data.is_staff ? 'Administrator' : 'Doctor'
                }
            }));
        })
        .catch((err) => {
            dispatch(updateToast({
                bodyMessage : err.response.data,
                isVisible : true,
                type: 'error'
            }))
        })
    },[sortList, page, filter]);
    
    const resetField = () => {
        setCreatedUsername('');
        setCreatedPassword('');
        setCreatedConfirmPassword('');
        setCreatedFirstName('');
        setCreatedLastName('');
        setCreatedEmail('');
        setCreateRole(false);
    }

    const resetErrors = () => {
        setUsernameError(null);
        setPasswordError(null);
        setConfirmPasswordError(null);
        setFirstNameError(null);
        setLastNameError(null);
        setEmailError(null);
    }

    const createUser = () => {
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
    
            if (createdPassword === '') {
                setPasswordError('Enter a password');
                noError = false;
            } else if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(createdPassword)){
                setPasswordError('Password should be atleast 8 characters, with alteast 1 upper case letter, 1 lower case letter, 1 number and one of these special characters ! @ # $ % ^ & *');
                noError = false;
            } else {
                setPasswordError(null);
            }

            if(createdConfirmPassword === ''){
                setConfirmPasswordError('Enter a password');
                noError = false;
            } else if (createdPassword !== createdConfirmPassword){
                setConfirmPasswordError('Does not match entered password');
                noError = false;
            } else {
                setConfirmPasswordError(null);
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
                ApiService.post(
                    'auth/users/',
                    {
                        username: createdUsername,
                        password: createdPassword,
                        first_name: createdFirstName,
                        last_name: createdLastName,
                        email: createdEmail,
                        is_staff: createRole
                    }
                )
                .then((res) => {
                    dispatch(updateToast({
                        bodyMessage : 'User created successfully.',
                        isVisible : true,
                        type: 'success'
                    }))
                    setFilter(!filter);
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
    
    return <>
        <Container>
        <ModalForm
            buttonLabel={'Create user'}
            formTitle={'Create user'}
            buttonVariant="contained"
            formFields={createForm}
            onFormClose={() => {
                resetField();
                resetErrors();
            }}
            onSubmit={createUser}/>
        </Container>
        <PaginationTable
        headers = {header}
        data = {data}
        pageNumber = {page}
        setPageNumber = {setPage}
        onFilter = {() => setFilter(!filter)}
        onReset = {resetFilters}
        onSortAsc = {onSortAsc}
        onSortDesc = {onSortDesc}
        sortList = {sortList}
        totalCount={totalCount}
        onRowClick={onClick}/>
    </>
}