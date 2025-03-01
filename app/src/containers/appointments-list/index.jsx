import { useDispatch, useSelector } from "react-redux";
import ApiService from "../../services/apiservice";
import { chipVariant, columnWidth, inputTypes } from "../../constants";
import PaginationTable from "../../components/table";
import { raiseError, updateToast } from "../../store/toastSlice";
import { useState, useEffect } from "react";
import moment from 'moment';
import { Container } from "./index.style";
import ModalForm from "../../components/modal-form";
import Chip from "../../components/chip";
import Filter from "../../components/filter";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from "react-router-dom";

export default function AppointmentList(props){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const profile = useSelector(state => state.profile);
    const queryClient = useQueryClient();

    const {id} = useParams();

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
    
    const [error, setError] = useState({
        date: null,
        time: null,
        visitType: null,
        createdFor: null,
        desc: null
    });

    const [page, setPage] = useState(0);
    const [sortList, setSortList] = useState([]);

    const filterForm = [
        {
            label: '#',
            type: inputTypes.text,
            key: 'id'
        },
        [
            {
                width: '40%',
                error: false,
                type: inputTypes.select,
                key: 'dateLookup',
                default: 'e',
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
                key: 'date',
            },
        ],
        [
            {
                width: '40%',
                error: false,
                type: inputTypes.select,
                key: 'timeLookup',
                default: 'e',  
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
                key: 'time',
            },
        ],
        {
            label: 'Visit type',
            error: false,
            type: inputTypes.select,
            key: 'visitType',
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
            key: 'createdFor',
        },
        {
            label: 'Status',
            error: false,
            type: inputTypes.select,
            key: 'isClosed',
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
        setSortList([]);
        setFilterChips({});
    }

    const onClick = (data) => {
        navigate(`${data.id}/`);
    }

    const fetchAppointmentData = ({ queryKey }) => {
        const [, { sortList, page, filterInput }] = queryKey;
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
        return ApiService.get(
            'appointments/',
            appointmentParams
        );
    };

    const { data: appointmentData, isLoading, isError: appointmentIsError, error: appointmentError } = useQuery({
        queryKey: ['appointments', { sortList, page, filterInput }],
        queryFn: fetchAppointmentData,
        staleTime: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        cacheTime: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        select: (res) => {
            return {
                totalCount: res.data.count,
                results: res.data.results.map((data) => ({
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
                })),
            };
        }
    });

    useEffect(() => {
        if(appointmentIsError){
            dispatch(raiseError({
                error: appointmentError.response?.data ?? null,
                status: appointmentError.status
            }))
        }
    }, [appointmentIsError])

    useEffect(() => {
        if(isNaN(id)){
            if(id === 'today_open'){
                setFilterInput({
                    ...filterInput,
                    date: moment(),
                    time: moment(),
                    dateLookup: 'e',
                    timeLookup: 'gt',
                    isClosed: false
                })
            }
            if(id === 'today_closed'){
                setFilterInput({
                    ...filterInput,
                    date: moment(),
                    time: null,
                    dateLookup: 'e',
                    timeLookup: 'e',
                    isClosed: true
                })
            }
            if(id === 'today_past_due'){
                setFilterInput({
                    ...filterInput,
                    date: moment(),
                    time: moment(),
                    dateLookup: 'e',
                    timeLookup: 'lt',
                    isClosed: false
                })
            }
            if(id === 'lifetime_open'){
                setFilterInput({
                    ...filterInput,
                    date: moment().subtract(1, 'days'),
                    dateLookup: 'gt',
                    isClosed: false
                })
            }
            if(id === 'lifetime_closed'){
                setFilterInput({
                    ...filterInput,
                    isClosed: true
                })                
            }
            if(id === 'lifetime_past_due'){
                setFilterInput({
                    ...filterInput,
                    date: moment(),
                    dateLookup: 'lt',
                    isClosed: false
                })
            }
            navigate('/appointment-list/');
        }
    }, [id]);
    
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
                }
            }
        }
        if(filterInput.isClosed !== null){
            tempFilter['Status'] = {
                value: filterInput.isClosed === false ? 'Open' : 'Closed',
                lookup: '',
                onRemove: () => {
                    setFilterInput((prevState) => {
                        return {
                            ...prevState,
                            isClosed: null
                        }
                    })
                }
            }
        }
        setFilterChips({...tempFilter});
    },[filterInput])

    const resetErrors = () => {
        setError({
            date: null,
            time: null,
            visitType: null,
            createdFor: null,
            desc: null
        });
    }

    const fetchDoctorData = () => {
        return ApiService.get(
            'users/doctors/'
        );
    };
    
    const { data: doctors, isError: doctorIsError, error: doctorError } = useQuery({
        queryKey: ['doctors'],
        queryFn: fetchDoctorData,
        enabled: profile.isStaff,
        staleTime: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        cacheTime: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        select: (res) => {
            return res.data.map((data) => ({
                label: `${data.first_name} ${data.last_name}`,
                value: data.id
            }));
        }
    });

    useEffect(() => {
        if(doctorIsError){
            dispatch(raiseError({
                error: doctorError.response?.data ?? null,
                status: doctorError.status
            }))
        }
    }, [doctorIsError])

    let createForm = [
        {
            label: 'Select appointement date',
            error: error.date,
            type: inputTypes.date,
            key: 'date'
        },
        {
            label: 'Select appointement time',
            error: error.time,
            type: inputTypes.time,
            key: 'time'
        },
        {
            label: 'Select visit type',
            error: error.visitType,
            type: inputTypes.select,
            key: 'visitType',
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
            options: doctors ?? [],
            key: 'createdFor'
        })
    }

    createForm.push({
        label: 'Description',
        error: error.desc,
        type: inputTypes.textArea,
        key: 'desc'
    })

    const createAppointment = (data) => {
        return new Promise((resolve, reject) => {
            let noError = true;
            let dtError = null;
            let tError = null;
            let vError = null;
            let cError = null;
            let dError = null;

            if(data.date === null){
                dtError = 'Please select a date';
                noError = false;
            } else if (
                moment(data.date).isSameOrBefore(moment().startOf('day')) &&
                data.time !== null && 
                moment(data.time, 'HH:mm').isSameOrBefore(moment())
            ){
                dtError = 'Please select a date after today';
                noError = false;
            }

            if(data.time === null){
                tError = 'Please selecct a time';
                noError = false;
            } else if (
                moment(data.date).isSame(moment().startOf('day')) &&
                moment(data.time, 'HH:mm').isSameOrBefore(moment())
            ){
                tError = 'Please select a time after now';
                noError = false;
            }

            if(data.createdFor === null && profile.isStaff){
                cError = 'Please select a doctor';
                noError = false;
            }

            if(data.visitType === null){
                vError = 'Please select a vist type';
                noError = false;
            }

            if(!data.desc){
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
                        "date": moment(data.date).format('YYYY-MM-DD'),
                        "time": moment(data.time).format('HH:mm:ss'),
                        "visit_type": data.visitType,
                        "created_for": data.createdFor,
                        "description": data.desc
                    }
                    
                )
                .then((res) => {
                    dispatch(updateToast({
                        bodyMessage : 'Appointment created successfully',
                        isVisible : true,
                        type: 'success'
                    }));
                    queryClient.invalidateQueries(['appointments']);
                    resolve(res.data);
                })
                .catch((err) => {
                    const error = err.response.data
                    dispatch(raiseError({
                        error: error ?? null,
                        status: err.status
                    }))
                    
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

    const handleFilter = (data) => {
        return new Promise((resolve, reject) => {
            setFilterInput(data)
            resolve(data)
        })
    }
    
    return <>
        <Container>
        <Filter
            leftButton={
                <ModalForm
                buttonLabel={'Create appointment'}
                formTitle={'CREATE APPOINTMENT'}
                buttonVariant="contained"
                formFields={createForm}
                onFormClose={() => {
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
        data = {appointmentData?.results || []}
        pageNumber = {page}
        setPageNumber = {setPage}
        onReset = {resetFilters}
        onSortAsc = {onSortAsc}
        onSortDesc = {onSortDesc}
        sortList = {sortList}
        totalCount={appointmentData?.totalCount || 0}
        onRowClick={onClick}/>
    </>
}