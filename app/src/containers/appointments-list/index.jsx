import { useDispatch, useSelector } from "react-redux";
import ApiService from "../../services/apiservice";
import { chipVariant, columnWidth, inputTypes } from "../../constants";
import PaginationTable from "../../components/table";
import { updateToast } from "../../store/toastSlice";
import { useState, useEffect } from "react";
import moment from 'moment';
import { Container } from "./index.style";
import ModalForm from "../../components/modal-form";
import Chip from "../../components/chip";
import Filter from "../../components/filter";

export default function AppointmentList(props){
    const {
        navigate
    } = props;
    const dispatch = useDispatch();
    const profile = useSelector(state => state.profile);

    const [filterInput, setFilterInput] = useState({
        id: '',
        date: null,
        time: null,
        dateLookup: 'e',
        timeLookup: 'e',
        visitType: null,
        createdFor: '',
        isClosed: null
    });

    const [filterChips, setFilterChips] = useState({});

    const [formInput, setFormInput] = useState({
        date: null,
        time: null,
        visitType: null,
        createdFor: null,
        desc: ''
    });
    
    const [error, setError] = useState({
        date: null,
        time: null,
        visitType: null,
        createdFor: null,
        desc: null
    });

    const [page, setPage] = useState(0);
    const [sortList, setSortList] = useState([]);
    const [filter, setFilter] = useState(true);
    const [data, setData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    const [doctors, setDoctors] = useState([]);

    const filterForm = [
        {
            label: '#',
            type: inputTypes.text,
            value: filterInput.id,
            setValue: (event) =>  setFilterInput({
                ...filterInput,
                id: event.target.value
            })
        },
        [
            {
                width: '40%',
                error: false,
                type: inputTypes.select,
                value: filterInput.dateLookup,
                setValue: (event) =>  setFilterInput({
                    ...filterInput,
                    dateLookup: event.target.value
                }),
                options: [
                  {
                    label: 'On',
                    value: 'e'
                  },
                  {
                    label: 'Before',
                    value: 'lt'
                  },
                  {
                    label: 'After',
                    value: 'gt'
                  }
                ]      
            },
            {
                width: '60%',
                label: 'Date',
                type: inputTypes.date,
                value: filterInput.date,
                setValue: (value) =>  {
                    const parsedDate = moment(value);
                    setFilterInput({
                        ...filterInput,
                        date: parsedDate
                    });
                }
            },
        ],
        [
            {
                width: '40%',
                error: false,
                type: inputTypes.select,
                value: filterInput.timeLookup,
                setValue: (event) =>  setFilterInput({
                    ...filterInput,
                    timeLookup: event.target.value
                }),
                options: [
                  {
                    label: 'On',
                    value: 'e'
                  },
                  {
                    label: 'Before',
                    value: 'lt'
                  },
                  {
                    label: 'After',
                    value: 'gt'
                  }
                ]      
            },
            {
                width: '60%',
                label: 'Time',
                type: inputTypes.time,
                value: filterInput.time,
                setValue: (value) =>  {
                    const parsedTime = moment(value);
                    setFilterInput({
                        ...filterInput,
                        time: parsedTime
                    });
                }
            },
        ],
        {
            label: 'Visit type',
            error: false,
            type: inputTypes.select,
            value: filterInput.visitType,
            setValue: (event) =>  setFilterInput({
                ...filterInput,
                visitType: event.target.value
            }),
            options: [
              {
                label: 'In person',
                value: 'I'
              },
              {
                label: 'Virtual',
                value: 'V'
              }
            ]      
        },
        {
            label: 'Created for',
            type: inputTypes.text,
            value: filterInput.createdFor,
            setValue: (event) =>  setFilterInput({
                ...filterInput,
                createdFor: event.target.value
            })
        },
        {
            label: 'Status',
            error: false,
            type: inputTypes.select,
            value: filterInput.isClosed,
            setValue: (event) =>  setFilterInput({
                ...filterInput,
                isClosed: event.target.value
            }),
            options: [
              {
                label: 'Closed',
                value: true
              },
              {
                label: 'Open',
                value: false
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
        date : {
          label: 'Appointment date',
          align: 'left',
          canSort: true,
          width: columnWidth.l
        },
        time : {
            label: 'Appointment time',
            align: 'left',
            canSort: true,
            width: columnWidth.l
        },
        visit_type : {
            label: 'Visit type',
            align: 'right',
            width: columnWidth.m,
        },
        created_for : {
            label: 'Created for',
            align: 'left',
            canSort: true,
            width: columnWidth.xl
        },
        is_closed : {
            label: 'Status',
            align: 'right',
            width: columnWidth.m
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
        setFilterInput({
            id: '',
            date: null,
            time: null,
            visitType: null,
            createdFor: '',
            isClosed: null,
            dateLookup: 'e',
            timeLookup: 'e'
        })
        setPage(0);
        setTotalCount(0);
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
        navigate(`appointment-details/${data.id}/`)
    }
    
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
        if(filterInput.date){
            tempFilter['Date'] = {
                value: filterInput.date.format('DD MMM, YYYY'),
                lookup: filterInput.dateLookup === 'gt' ? 'After' :
                        filterInput.dateLookup === 'lt' ? 'Before' : '',
                onRemove: () => {
                    setFilterInput((prevState) => {
                        return {
                            ...prevState,
                            date: null,
                            dateLookup: 'e'
                        }
                    });
                    setFilter((prevState) => !prevState);
                }
            }
        }
        if(filterInput.time){
            tempFilter['Time'] = {
                value: filterInput.time.format('hh:mm A'),
                lookup: filterInput.timeLookup === 'gt' ? 'After' :
                        filterInput.timeLookup === 'lt' ? 'Before' : '',
                onRemove: () => {
                    setFilterInput((prevState) => {
                        return {
                            ...prevState,
                            time: null,
                            timeLookup: 'e'
                        }
                    })
                    setFilter((prevState) => !prevState);
                }
            }
        }
        if(filterInput.visitType){
            tempFilter['Visit type'] = {
                value: filterInput.visitType === "V" ? "Virtual" : "In Person",
                lookup: '',
                onRemove: () => {
                    setFilterInput((prevState) => {
                        return {
                            ...prevState,
                            visitType: null
                        }
                    })
                    setFilter((prevState) => !prevState);
                }
            }
        }
        if(filterInput.createdFor){
            tempFilter['Created for'] = {
                value: filterInput.createdFor,
                lookup: '',
                onRemove: () => {
                    setFilterInput((prevState) => {
                        return {
                            ...prevState,
                            createdFor: ''
                        }
                    })
                    setFilter((prevState) => !prevState);
                }
            }
        }
        if(filterInput.isClosed !== null){
            tempFilter['Status'] = {
                value: filterInput.isClosed,
                lookup: '',
                onRemove: () => {
                    setFilterInput((prevState) => {
                        return {
                            ...prevState,
                            isClosed: null
                        }
                    })
                    setFilter((prevState) => !prevState);
                }
            }
        }
        setFilterChips({...tempFilter});

        //construct params
        let appointmentParams = {
            id: filterInput.id,
            created_for: filterInput.createdFor,
            is_closed: filterInput.isClosed,
            visit_type: filterInput.visitType,
            ordering: sortList.join(','),
            page: page + 1
        }
        if(filterInput.date){
            if(filterInput.dateLookup === 'e'){
                appointmentParams['date'] = filterInput.date.format('YYYY-MM-DD');
            }
            if(filterInput.dateLookup === 'lt'){
                appointmentParams['date__lt'] = filterInput.date.format('YYYY-MM-DD');
            }
            if(filterInput.dateLookup === 'gt'){
                appointmentParams['date__gt'] = filterInput.date.format('YYYY-MM-DD');
            }
        }
        if(filterInput.time){
            if(filterInput.timeLookup === 'e'){
                appointmentParams['time'] = filterInput.time.format('HH:mm:ss');
            }
            if(filterInput.timeLookup === 'lt'){
                appointmentParams['time__lt'] = filterInput.time.format('HH:mm:ss');
            }
            if(filterInput.timeLookup === 'gt'){
                appointmentParams['time__gt'] = filterInput.time.format('HH:mm:ss');
            }
        }

        //ping the server
        ApiService.get(
            'appointments/',
            appointmentParams
        )
        .then((res) => {
            setTotalCount(res.data.count);
            setData(res.data.results.map((data) => {
                return {
                    ...data,
                    date: moment(data.date).format('DD MMM, YYYY'),
                    time: moment(data.time, "HH:mm:ss").format('hh:mm A'),
                    visit_type: <Chip
                                    align={'flex-end'}
                                    label={data.visit_type_full}
                                    variant={data.visit_type === 'I' ? chipVariant.inPerson : chipVariant.virtual}/>,
                    is_closed:  <Chip
                                    align={'flex-end'}
                                    label={data.is_closed ? 'Closed' : 'Open'}
                                    variant={data.is_closed ? chipVariant.closed : chipVariant.open}/>,
                    created_for: data.created_for_full_name
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
    },[sortList, page, filter])

    const resetField = () => {
        setFormInput({
            date: null,
            time: null,
            visitType: null,
            createdFor: null,
            desc: ''
        });
    }

    const resetErrors = () => {
        setError({
            date: null,
            time: null,
            visitType: null,
            createdFor: null,
            desc: null
        });
    }

    useEffect(() => {
        if(profile.isStaff){
            ApiService.get(
                'users/doctors/'
            )
            .then((res) => {
                setDoctors(res.data.map((doctor) => {
                    return {
                        label: `${doctor.first_name} ${doctor.last_name}`,
                        value: doctor.id
                    }
                }))
            })
            .catch((err) => {
                dispatch(updateToast({
                    bodyMessage : err.response.data,
                    isVisible : true,
                    type: 'error'
                }));
            })
        }
    }, [])

    let createForm = [
        {
            label: 'Select appointement date',
            error: error.date,
            type: inputTypes.date,
            value: formInput.date,
            setValue: (value) =>  {
                const parsedDate = moment(value);
                setFormInput({
                    ...formInput,
                    date: parsedDate
                });
            }
        },
        {
            label: 'Select appointement time',
            error: error.time,
            type: inputTypes.time,
            value: formInput.time,
            setValue: (value) =>  {
                const parsedTime = moment(value);
                setFormInput({
                    ...formInput,
                    time: parsedTime
                });
            }
        },
        {
            label: 'Select visit type',
            error: error.visitType,
            type: inputTypes.select,
            value: formInput.visitType,
            setValue: (event) =>  setFormInput({
                ...formInput,
                visitType: event.target.value
            }),
            options: [
                {
                  label: 'In person',
                  value: 'I'
                },
                {
                  label: 'Virtual',
                  value: 'V'
                }
            ]  
        }
    ]

    if(profile.isStaff){
        createForm.push({
            label: 'Select who the appointment is for',
            error: error.createdFor,
            type: inputTypes.select,
            value: formInput.createdFor,
            setValue: (event) =>  setFormInput({
                ...formInput,
                createdFor: event.target.value
            }),
            options: doctors
        })
    }

    createForm.push({
        label: 'Description',
        error: error.desc,
        type: inputTypes.textArea,
        value: formInput.desc,
        setValue: (event) =>  setFormInput({
            ...formInput,
            desc: event.target.value
        })
    })

    const createAppointment = () => {
        return new Promise((resolve, reject) => {
            let noError = true;
            let dtError = null;
            let tError = null;
            let vError = null;
            let cError = null;
            let dError = null;

            if(formInput.date === null){
                dtError = 'Please select a date';
                noError = false;
            } else if (moment(formInput.date).isSameOrBefore(moment().startOf('day'))){
                dtError = 'Please select a date after today';
                noError = false;
            }

            if(formInput.time === null){
                tError = 'Please selecct a time';
                noError = false;
            }

            if(formInput.createdFor === null && profile.isStaff){
                cError = 'Please select a doctor';
                noError = false;
            }

            if(formInput.visitType === null){
                vError = 'Please select a vist type';
                noError = false;
            }

            if(!formInput.desc){
                dError = 'Please enter a description';
                noError = false;
            }

            setError({
                date: dtError,
                time: tError,
                visitType: vError,
                createdFor: cError,
                desc: dError
            })

            if(noError){
                ApiService.post(
                    'appointments/',
                    {
                        "date": moment(formInput.date).format('YYYY-MM-DD'),
                        "time": moment(formInput.time).format('HH:mm:ss'),
                        "visit_type": formInput.visitType,
                        "created_for": formInput.createdFor,
                        "description": formInput.desc
                    }
                    
                )
                .then((res) => {
                    dispatch(updateToast({
                        bodyMessage : 'Appointment created successfully',
                        isVisible : true,
                        type: 'success'
                    }));
                    setFilter(!filter);
                    resolve(res.data);
                })
                .catch((err) => {
                    const error = err.response.data
                    dispatch(updateToast({
                        bodyMessage : `The user is already booked for ${error.conflicting_slots.join(', ')}`,
                        isVisible : true,
                        type: 'error'
                    }));
                    reject(err);
                })
            }
            else{
                reject({
                    error: 'Validation error'
                })
            }
        })
    }
    
    return <>
        <Container>
        <Filter
            leftButton={
                <ModalForm
                buttonLabel={'Create appointment'}
                formTitle={'Create appointment'}
                buttonVariant="contained"
                formFields={createForm}
                onFormClose={() => {
                    resetField();
                    resetErrors();
                }}
                onSubmit={createAppointment}/>
            }
            onFilter={handleFilter}
            onReset={resetFilters}
            filterForm={filterForm}
            filters={filterChips}/>
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