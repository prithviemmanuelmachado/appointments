import moment from "moment";
import Filter from "../../components/filter";
import { ButtonCell, Cell, Container, Label, SubLabel } from "./index.style";
import { useEffect, useState } from "react";
import { inputTypes } from "../../constants";
import ApiService from "../../services/apiservice";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { raiseError } from "../../store/toastSlice";
import { IconButton, Table, TableBody, TableContainer, TableHead, TableRow } from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CalendarItem from "../../components/calendar-item";

export default function Calendar(props){

    const dispatch = useDispatch();

    const getWeekDays = (date) => {
        if(date){
            return {
                sunday: moment(date).startOf('week'),
                monday: moment(date).startOf('week').add(1, 'day'),
                tuesday: moment(date).startOf('week').add(2, 'day'),
                wednesday: moment(date.startOf('week')).add(3, 'day'),
                thursday: moment(date).startOf('week').add(4, 'day'),
                friday: moment(date).startOf('week').add(5, 'day'),
                saturday: moment(date).startOf('week').add(6, 'day')
            }
        }
        return {
            sunday: moment().startOf('week'),
            monday: moment().startOf('week').add(1, 'day'),
            tuesday: moment().startOf('week').add(2, 'day'),
            wednesday: moment().startOf('week').add(3, 'day'),
            thursday: moment().startOf('week').add(4, 'day'),
            friday: moment().startOf('week').add(5, 'day'),
            saturday: moment().endOf('week')
        }
    }

    const [filterInput, setFilterInput] = useState({
        createdFor: '',
        fromDate: getWeekDays().sunday,
        toDate: getWeekDays().saturday
    });
    const [filterChips, setFilterChips] = useState({});
    const [headers, setHeaders] = useState({});
    const [timeSlots, setTimeSlots] = useState([]);
    const [data, setData] = useState({});

    useEffect(() => {
        //generate time slots
        const startTime = moment().startOf('day'); // 12 AM
        const endTime = moment().startOf('day').add(23, 'hours'); // 11 AM next day
        let temp = []

        let currentTime = startTime.clone();
        while (currentTime.isBefore(endTime) || currentTime.isSame(endTime)) {
            temp.push(currentTime.format('hh:mm A'));
            currentTime.add(1, 'hour');
        }
        setTimeSlots([...temp])
    }, []);

    const resetFilters = () => {
        setFilterInput({
            createdFor: '',
            fromDate: getWeekDays().sunday,
            toDate: getWeekDays().saturday
        });
        setFilterChips({});
    }

    const handleFilter = (data) => {
        return new Promise((resolve, reject) => {
            setFilterInput({
                createdFor: data.createdFor,
                fromDate: getWeekDays(data.date).sunday,
                toDate: getWeekDays(data.date).saturday
            })
            resolve(data)
        })
    }

    const filterForm = [
        {
            label: 'Created for',
            type: inputTypes.text,
            key: 'createdFor',
        },
        {
            label: 'Date',
            type: inputTypes.date,
            key: 'date',
        }
    ];

    useEffect(() => {
        //set the chips
        let tempFilter = {};
        
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

        if(filterInput.fromDate && filterInput.toDate){
            tempFilter['Date range'] = {
                value: `${filterInput.fromDate.format('DD MMM, YYYY')} - ${filterInput.toDate.format('DD MMM, YYYY')}`,
                lookup: ''
            }
        }

        setFilterChips({...tempFilter});
    },[filterInput])

    const fetchCalendar = ({ queryKey }) => {
        const [, { filterInput }] = queryKey;
        console.log(filterInput)
        return ApiService.get(
            'appointments/calendar',
            {
                date__gt: filterInput.fromDate.format('YYYY-MM-DD'),
                date__lt: filterInput.toDate.format('YYYY-MM-DD'),
                created_for: filterInput.createdFor
            }
        );
    }

    const { data: calender, isLoading, isError, error } = useQuery({
        queryKey: ['calendar', {filterInput}],
        queryFn: fetchCalendar,
        staleTime: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        cacheTime: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        select: (res) => {
            return res.data
        }
    });

    useEffect(() => {
        if(isError && error.status !== 404){
            dispatch(raiseError({
                error: error.response?.data ?? null,
                status: error.status
            }))
        }
    }, [isError])

    useEffect(() => {
        if(isLoading === false && calender){
            const temp = {}
            calender.forEach(appointment => {
                let date = appointment.date;
                let time = moment(appointment.time, "HH:mm:ss").minute(0).format("hh:mm A");
                if(!temp[date]){
                    temp[date] = {}
                }
                
                if(!temp[date][time]){
                    temp[date][time] = []
                }

                temp[date][time].push(appointment)
            })

            setData({...temp})
        }
    }, [isLoading, calender])

    useEffect(() => {
        if(filterInput.fromDate && filterInput.toDate){
            const week = getWeekDays(filterInput.fromDate);
            let temp = {}

            Object.keys(week).forEach(day => {
                temp[week[day].format('YYYY-MM-DD')] = {
                    label: week[day].format('DD MMM, YYYY'),
                    subLabel: day.toUpperCase()
                } 
            })

            setHeaders({...temp})
        }
    }, [filterInput.fromDate, filterInput.toDate]);

    const goBackOneWeek = () => {
        const temp = getWeekDays(filterInput.fromDate.subtract(1, 'day'));
        setFilterInput({
            ...filterInput,
            fromDate: temp.sunday,
            toDate: temp.saturday
        })
    }

    const goForwardOneWeek = () => {
        const temp = getWeekDays(filterInput.toDate.add(1, 'day'));
        setFilterInput({
            ...filterInput,
            fromDate: temp.sunday,
            toDate: temp.saturday
        })
    }

    return <>
        <Container>
        <Filter
            onFilter={handleFilter}
            onReset={resetFilters}
            filterForm={filterForm}
            filters={filterChips}/>
        </Container>
        <TableContainer
            sx={{
                maxHeight: '75%',
                minHeight: '75%'
            }}>
            <Table
                stickyHeader={true}
                aria-label="sticky table">
                <TableHead>
                    <TableRow> 
                        <Cell></Cell>
                        <ButtonCell>
                            <IconButton
                                onClick={goBackOneWeek}>
                                <ChevronLeftIcon/>
                            </IconButton>
                        </ButtonCell>
                        {
                            Object.keys(headers).map((day, index) => {
                                return <Cell key={`calender-${day}-${index}`}>
                                    <Label>{headers[day].label}</Label>
                                    <SubLabel>{headers[day].subLabel}</SubLabel>
                                </Cell>
                            })
                        }        
                        <ButtonCell>
                            <IconButton
                                onClick={goForwardOneWeek}>
                                <ChevronRightIcon/>
                            </IconButton>
                        </ButtonCell>               
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        timeSlots.map((slot, sIndex) => {
                            return <TableRow key={`calender-row-${sIndex}`}>
                                <Cell>
                                    <SubLabel>
                                        {slot}
                                    </SubLabel>
                                </Cell>
                                <ButtonCell></ButtonCell>
                                {
                                    Object.keys(headers).map((date, dIndex) => {
                                        return<Cell key={`Cell-${sIndex}-${dIndex}`}>
                                            {
                                                data[date] ?
                                                data[date][slot] ?                                                
                                                data[date][slot].map((appointment, aIndex) => {
                                                    return <CalendarItem
                                                                isLast={aIndex === data[date][slot].length - 1}
                                                                isFirst={aIndex === 0}
                                                                key={`item--${sIndex}-${dIndex}-${aIndex}`}
                                                                data={appointment}/>
                                                }) :<></> :<></>
                                            }
                                        </Cell>
                                    })
                                }
                                <ButtonCell></ButtonCell>
                            </TableRow>
                        })
                    }
                </TableBody>
            </Table>
        </TableContainer>
    </>
}