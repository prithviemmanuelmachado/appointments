import { useEffect, useState } from "react";
import ApiService from "../../services/apiservice";
import { chipVariant, columnWidth, inputTypes } from "../../constants";
import PaginationTable from "../../components/table";
import { useDispatch } from "react-redux";
import { raiseError, updateToast } from "../../store/toastSlice";
import ModalForm from "../../components/modal-form";
import { Container } from "./index.style";
import Chip from "../../components/chip";
import Filter from "../../components/filter";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from "react-router-dom";

export default function UserManagementList(props){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    const [filterInput, setFilterInput] = useState({
        id: '',
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        isActive: null,
        isStaff: null
    });
    
    const [error, setError] = useState({
        username: null,
        firstName: null,
        lastName: null,
        email: null
    });

    const [page, setPage] = useState(0);
    const [sortList, setSortList] = useState([]);
    const [filter, setFilter] = useState(true);
    const [filterChips, setFilterChips] = useState({});

    const filterForm = [
        {
            label: '#',
            type: inputTypes.text,
            key: 'id',
        },
        {
            label: 'First name',
            type: inputTypes.text,
            key: 'firstName',
        },
        {
            label: 'Last name',
            type: inputTypes.text,
            key: 'lastName',
        },
        {
            label: 'Username',
            type: inputTypes.text,
            key: 'username',
        },
        {
            label: 'Email',
            type: inputTypes.text,
            key: 'email',
        },
        {
            label: 'Status',
            type: inputTypes.select,
            key: 'isActive',
            error: false,
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
        },
        {
            label: 'Role',
            type: inputTypes.select,
            key: 'isStaff',
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
        }
    ];

    const header = {
        id: {
          label: '#',
          align: 'left',
          canSort: true,
          width: columnWidth.xs
        },
        first_name : {
          label: 'First name',
          align: 'left',
          canSort: true,
          width: columnWidth.l
        },
        last_name : {
            label: 'Last name',
            align: 'left',
            canSort: true,
            width: columnWidth.l
        },
        username : {
            label: 'Username',
            align: 'left',
            canSort: true,
            width: columnWidth.l
        },
        email : {
            label: 'Email',
            align: 'left',
            canSort: true,
            width: columnWidth.xl
        },
        is_active : {
            label: 'Status',
            align: 'right',
            width: columnWidth.m
        },
        is_staff : {
            label: 'Role',
            align: 'right',
            width: columnWidth.m
        }
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
        setFilterInput({
            id: '',
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            isActive: null,
            isStaff: null
        });
        setPage(0);
        setSortList([]);
        setFilterChips({});
    }

    const handleFilter = () => {
        return new Promise((resolve, reject) => {
            setFilter((prevState) => !prevState);
            resolve({});
        });
    }

    const onClick = (data) => {
        navigate(`${data.id}/`)
    }

    const fetchUserData = ({ queryKey }) => {
        const [, { sortList, page, filterInput }] = queryKey;
        return ApiService.get('users/', {
            username: filterInput.username,
            first_name: filterInput.firstName,
            last_name: filterInput.lastName,
            id: filterInput.id,
            email: filterInput.email,
            is_active: filterInput.isActive,
            is_staff: filterInput.isStaff,
            ordering: sortList.join(','),
            page: page + 1,
        });
    };

    const { data: userData, isLoading, isError: userDetailsIsError, error: userDetailsError } = useQuery({
        queryKey: ['userData', { sortList, page, filterInput }],
        queryFn: fetchUserData,
        staleTime: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        cacheTime: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        select: (res) => {
            return {
                totalCount: res.data.count,
                results: res.data.results.map((data) => ({
                    ...data,
                    is_active: (
                        <Chip
                            align={'flex-end'}
                            label={data.is_active ? 'Active' : 'Inactive'}
                            variant={data.is_active ? chipVariant.active : chipVariant.inactive}
                        />
                    ),
                    is_staff: (
                        <Chip
                            align={'flex-end'}
                            label={data.is_staff ? 'Administrator' : 'Doctor'}
                            variant={data.is_staff ? chipVariant.admin : chipVariant.doctor}
                        />
                    ),
                })),
            };
        }
    });

    useEffect(() => {
        if(userDetailsIsError){
            dispatch(raiseError({
                error: userDetailsError.response?.data ?? null,
                status: userDetailsError.status
            }))
        }
    }, [userDetailsIsError])
    
    useEffect(() => {
        //set the chips
        let tempFilter = {};
        if(filterInput.id){
            tempFilter['#'] = {
                value: filterInput.id,
                lookup: '',
                onRemove: () => {
                    setFilterInput((prevState) => {
                        return {
                            ...prevState,
                            id: ''
                        }
                    });
                    setFilter((prevState) => !prevState);
                }
            }
        }
        if(filterInput.firstName){
            tempFilter['First name'] = {
                value: filterInput.firstName,
                lookup: '',
                onRemove: () => {
                    setFilterInput((prevState) => {
                        return {
                            ...prevState,
                            firstName: ''
                        }
                    })
                    setFilter((prevState) => !prevState);
                }
            }
        }
        if(filterInput.lastName){
            tempFilter['Last name'] = {
                value: filterInput.lastName,
                lookup: '',
                onRemove: () => {
                    setFilterInput((prevState) => {
                        return {
                            ...prevState,
                            lastName: ''
                        }
                    })
                    setFilter((prevState) => !prevState);
                }
            }
        }
        if(filterInput.username){
            tempFilter['Username'] = {
                value: filterInput.username,
                lookup: '',
                onRemove: () => {
                    setFilterInput((prevState) => {
                        return {
                            ...prevState,
                            username: ''
                        }
                    })
                    setFilter((prevState) => !prevState);
                }
            }
        }
        if(filterInput.email){
            tempFilter['Email'] = {
                value: filterInput.email,
                lookup: '',
                onRemove: () => {
                    setFilterInput((prevState) => {
                        return {
                            ...prevState,
                            email: ''
                        }
                    })
                    setFilter((prevState) => !prevState);
                }
            }
        }
        if(filterInput.isStaff !== null){
            tempFilter['Role'] = {
                value: filterInput.isStaff ? 'Administrator' : 'Doctor',
                lookup: '',
                onRemove: () => {
                    setFilterInput((prevState) => {
                        return {
                            ...prevState,
                            isStaff: null
                        }
                    })
                    setFilter((prevState) => !prevState);
                }
            }
        }
        if(filterInput.isActive !== null){
            tempFilter['Status'] = {
                value: filterInput.isActive ? 'Active' : 'Inactive',
                lookup: '',
                onRemove: () => {
                    setFilterInput((prevState) => {
                        return {
                            ...prevState,
                            isActive: null
                        }
                    })
                    setFilter((prevState) => !prevState);
                }
            }
        }
        setFilterChips({...tempFilter});
    },[filter]);

    const resetErrors = () => {
        setError({
            username: null,
            firstName: null,
            lastName: null,
            email: null
        });
    }

    const createForm = [
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
        },
        {
            label: 'Select role',
            type: inputTypes.select,
            error: false,
            key: 'role',
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

    const createUser = (data) => {
        return new Promise((resolve, reject) => {
            let noError = true;
            let uError = null;
            let fError = null;
            let lError = null;
            let eError = null;
    
            if (!data.username) {
                uError = 'Enter a username';
                noError = false;
            } else if (!/^.{6,}$/.test(data.firstName)){
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
                lError = 'Enter last name';
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
                        email: data.email,
                        is_staff: data.role
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
                            bodyMessage : 'User created successfully.',
                            isVisible : true,
                            type: 'success'
                        }))
                        queryClient.invalidateQueries(['userData']);
                        resolve(res.data);
                    })
                    .catch((err) => {
                        dispatch(updateToast({
                            bodyMessage : 'User created successfully, but failed to add your avatar.',
                            isVisible : true,
                            type: 'success'
                        }))
                        queryClient.invalidateQueries(['userData']);
                        resolve(res.data);
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
    }
    
    return <>
        <Container>
        <Filter
            leftButton={
                <ModalForm
                buttonLabel={'Create user'}
                formTitle={'CREATE USER'}
                buttonVariant="contained"
                formFields={createForm}
                onFormClose={() => {
                    resetErrors();
                }}
                onSubmit={createUser}/>
            }
            onFilter={handleFilter}
            onReset={resetFilters}
            filterForm={filterForm}
            filters={filterChips}/>
        </Container>
        <PaginationTable
        headers = {header}
        data = {userData?.results || []}
        pageNumber = {page}
        setPageNumber = {setPage}
        onFilter = {() => setFilter(!filter)}
        onReset = {resetFilters}
        onSortAsc = {onSortAsc}
        onSortDesc = {onSortDesc}
        sortList = {sortList}
        totalCount={userData?.totalCount || 0}
        onRowClick={onClick}/>
    </>
}