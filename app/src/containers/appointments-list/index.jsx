import { useDispatch } from "react-redux";
import ApiService from "../../services/apiservice";
import { inputTypes } from "../../constants";
import PaginationTable from "../../components/table";
import { updateToast } from "../../store/toastSlice";
import { useState, useEffect } from "react";
import moment from 'moment';

export default function AppointmentList(props){
    const dispatch = useDispatch();

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
    const [totalCount, setTotalCount] = useState(0)

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
            console.log(res.data.results)
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
    
    
    return <PaginationTable
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
}