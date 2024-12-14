import { useDispatch, useSelector } from "react-redux";
import ApiService from "../../services/apiservice";
import { inputTypes } from "../../constants";
import PaginationTable from "../../components/table";
import { updateToast } from "../../store/toastSlice";
import { useState, useEffect } from "react";
import moment from 'moment';
import { Container } from "./index.style";
import ModalForm from "../../components/modal-form";

export default function AppointmentList(props){
    const dispatch = useDispatch();
    const profile = useSelector(state => state.profile);

    const [createdate, setcreateDate] = useState(null);
    const [createtime, setcreateTime] = useState(null);
    const [createvisitType, setcreateVisitType] = useState(null);
    const [createcreatedFor, setcreateCreatedFor] = useState(null);
    const [desc, setDesc] = useState('');

    const [dateError, setDateError] = useState(null);
    const [timeError, setTimeError] = useState(null);
    const [visitTypeError, setVisitTypeError] = useState(null);
    const [createdForError, setCreatedForError] = useState(null);

    const [id, setId] = useState('');
    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [visitType, setVisitType] = useState(null);
    const [createdFor, setCreatedFor] = useState('');
    const [isClosed, setIsClosed] = useState(null);

    const [page, setPage] = useState(0);
    const [sortList, setSortList] = useState([]);
    const [filter, setFilter] = useState(true);
    const [data, setData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    const [doctors, setDoctors] = useState([]);

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
        date : {
          label: 'Appointment date',
          align: 'left',
          canSort: true,
          width: '15%',
          input: {
            type: inputTypes.date,
            value: date,
            setValue: (value) =>  {
                const parsedDate = moment(value);
                setDate(parsedDate);
            }
          }
        },
        time : {
            label: 'Appointment time',
            align: 'left',
            canSort: true,
            width: '15%',
            input: {
                type: inputTypes.time,
                value: time,
                setValue: (value) =>  {
                    const parsedTime = moment(value);
                    setTime(parsedTime);
                }
            }
        },
        visit_type : {
            label: 'Visit type',
            align: 'right',
            width: '15%',
            input: {
              type: inputTypes.select,
              value: visitType,
              setValue: (event) =>  setVisitType(event.target.value),
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
        },
        created_for : {
            label: 'Created for',
            align: 'left',
            canSort: true,
            width: '30%',
            input: {
              type: inputTypes.text,
              value: createdFor,
              setValue: (event) =>  setCreatedFor(event.target.value)
            }
        },
        is_closed : {
            label: 'Status',
            align: 'right',
            width: '15%',
            input: {
              type: inputTypes.select,
              value: isClosed,
              setValue: (event) =>  setIsClosed(event.target.value),
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
        setId('');
        setDate(null);
        setTime(null);
        setCreatedFor('');
        setIsClosed(null);
        setVisitType(null);
        setPage(0);
        setTotalCount(0);
        setSortList([]);
    }

    const onClick = (data) => {
        console.log(data);
    }
    
    useEffect(() => {
        ApiService.get(
            'appointments/',
            {
                id: id,
                date: date ? date.format('YYYY-MM-DD') : null,
                time: time ? time.format('HH:mm:ss') : null,
                created_for: createdFor,
                is_closed: isClosed,
                visit_type: visitType,
                ordering: sortList.join(','),
                page: page + 1
            }
        )
        .then((res) => {
            setTotalCount(res.data.count);
            setData(res.data.results.map((data) => {
                return {
                    ...data,
                    date: moment(data.date).format('DD MMM, YYYY'),
                    time: moment(data.time, "HH:mm:ss").format('hh:mm A'),
                    visit_type: data.visit_type_full,
                    is_closed: data.is_closed ? 'Closed' : 'Open'
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
        setcreateDate(null);
        setcreateTime(null);
        setcreateVisitType(null);
        setcreateCreatedFor(null);
        setDesc(null);
    }

    const resetErrors = () => {
        setDateError(null);
        setTimeError(null);
        setVisitTypeError(null);
        setCreatedForError(null);
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
            error: dateError,
            type: inputTypes.date,
            value: createdate,
            setValue: (value) =>  {
                const parsedDate = moment(value);
                setcreateDate(parsedDate);
            }
        },
        {
            label: 'Select appointement time',
            error: timeError,
            type: inputTypes.time,
            value: createtime,
            setValue: (value) =>  {
                const parsedTime = moment(value);
                setcreateTime(parsedTime);
            }
        },
        {
            label: 'Select visit type',
            error: visitTypeError,
            type: inputTypes.select,
            value: createvisitType,
            setValue: (event) =>  setcreateVisitType(event.target.value),
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
            error: createdForError,
            type: inputTypes.select,
            value: createcreatedFor,
            setValue: (event) =>  setcreateCreatedFor(event.target.value),
            options: doctors
        })
    }

    createForm.push({
        label: 'Note',
        error: false,
        type: inputTypes.textArea,
        value: desc,
        setValue: (event) =>  setDesc(event.target.value)
    })

    const createAppointment = () => {
        return new Promise((resolve, reject) => {
            let noError = true;

            if(createdate === null){
                setDateError('Please select a date');
                noError = false;
            } else if (moment(createdate).isSameOrBefore(moment().startOf('day'))){
                setDateError('Please select a date after today');
                noError = false;
            } else {
                setDateError(null);
            }

            if(createtime === null){
                setTimeError('Please selecct a time');
                noError = false;
            } else {
                setTimeError(null);
            }

            if(createcreatedFor === null && profile.isStaff){
                setCreatedForError('Please select a doctor');
                noError = false;
            } else {
                setCreatedForError(null);
            }

            if(createvisitType === null){
                setVisitTypeError('Please select a vist type');
                noError = false;
            }

            if(noError){
                ApiService.post(
                    'appointments/',
                    {
                        "date": moment(createdate).format('YYYY-MM-DD'),
                        "time": moment(createtime).format('HH:mm:ss'),
                        "visit_type": createvisitType,
                        "created_for": createcreatedFor,
                        "notes": {
                            "description": desc
                        }
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
                    dispatch(updateToast({
                        bodyMessage : err.response.data,
                        isVisible : true,
                        type: 'error'
                    }));
                    reject(err);
                })
            }
        })
    }
    
    return <>
        <Container>
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