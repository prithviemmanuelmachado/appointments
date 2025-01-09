import { useDispatch } from "react-redux";
import ApiService from "../../services/apiservice";
import { updateToast } from "../../store/toastSlice";
import { 
    Chart, 
    ChartContainer, 
    DataContainer, 
    Indicator, 
    LegendContainer, 
    LegendRow, 
    NotificationList, 
    NotificationsContainer, 
    PieChartContainer, 
    Title 
} from "./index.style";
import { useQuery } from "@tanstack/react-query";
import { chipVariant } from '../../constants';
import { CircularProgress, Typography } from "@mui/material";
import { PieChart } from '@mui/x-charts/PieChart';
import moment from "moment";
import Chip from "../../components/chip";
import Notification from "../../components/notification";
import { useNavigate } from "react-router-dom";

export default function Dashboard(props){
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fetchChartData = () => {
        return ApiService.get(
            'appointments/stats'
        );
    };

    const { data: chart, isLoading: chartIsLoading, isError: chartIsError } = useQuery({
        queryKey: ['chart'],
        queryFn: fetchChartData,
        staleTime: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        cacheTime: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        select: (res) => {
            return res.data
        },
        onError: (err) => {
            dispatch(
                updateToast({
                    bodyMessage: err.response?.data || 'An error occurred',
                    isVisible: true,
                    type: 'error',
                })
            );
        }
    });

    const fetchTodaysAppointments = () => {
        return ApiService.get(
            'appointments/today'
        );
    }

    const { data: appointmentData, isLoading: appointmentIsLoading, isError: appointmentIsError } = useQuery({
            queryKey: ['appointments-today'],
            queryFn: fetchTodaysAppointments,
            staleTime: 24 * 60 * 60 * 1000, // 1 day in milliseconds
            cacheTime: 24 * 60 * 60 * 1000, // 1 day in milliseconds
            onError: (err) => {
                dispatch(
                    updateToast({
                        bodyMessage: err.response?.data || 'An error occurred',
                        isVisible: true,
                        type: 'error',
                    })
                );
            },
            select: (res) => {
                return res.data.map((data) => ({
                    ...data,
                    time: moment(data.time, "HH:mm:ss").format('hh:mm A'),
                    visit_type: <Chip
                                    align={'flex-end'}
                                    label={data.visit_type_full}
                                    variant={data.visit_type === 'I' ? chipVariant.inPerson : chipVariant.virtual}/>
                }));
            }
    });

    const itemClickedLifetime = (e, d) => {
        if(d.dataIndex === 0){
            navigate('/appointment-list/lifetime_open/')
        }
        if(d.dataIndex === 1){
            navigate('/appointment-list/lifetime_closed/')
        }
        if(d.dataIndex === 2){
            navigate('/appointment-list/lifetime_past_due/')
        }
    }

    const itemClickedToday = (e, d) => {
        if(d.dataIndex === 0){
            navigate('/appointment-list/today_open/')
        }
        if(d.dataIndex === 1){
            navigate('/appointment-list/today_closed/')
        }
        if(d.dataIndex === 2){
            navigate('/appointment-list/today_past_due/')
        }
    }
    
    return <>
    <ChartContainer>
        <Chart>
            <Title>Lifetime</Title>
            <DataContainer>
                <LegendContainer>
                    <LegendRow>
                        <Indicator
                            color={chipVariant.open}/>
                        Open
                    </LegendRow>
                    <LegendRow>
                        <Indicator
                            color={chipVariant.closed}/>
                        Closed
                    </LegendRow>
                    <LegendRow>
                        <Indicator
                            color={chipVariant.inactive}/>
                        Past due
                    </LegendRow>
                </LegendContainer>
                <PieChartContainer>
                    {
                        chartIsLoading ?
                        <CircularProgress
                            size={'5rem'}/>:
                        chartIsError ?
                        <>
                            No data available
                        </> :
                        chart.lifetime.total === 0 ?
                        <>
                            No data available
                        </> :
                        <PieChart
                            onItemClick={itemClickedLifetime}
                            slotProps = { {
                                legend: { hidden: true }
                            } }
                            series={[
                            {
                                data: [ 
                                    { 
                                        id: 0, 
                                        value: chart.lifetime.open, 
                                        label: 'Open' ,
                                        color: chipVariant.open
                                    },
                                    { 
                                        id: 1, 
                                        value: chart.lifetime.closed, 
                                        label: 'Closed' ,
                                        color: chipVariant.closed
                                    },
                                    { 
                                        id: 2, 
                                        value: chart.lifetime.past_due, 
                                        label: 'Past due' ,
                                        color: chipVariant.inactive
                                    }
                                ],
                                innerRadius: 85,
                                outerRadius: 100,
                                paddingAngle: 0,
                                cornerRadius: 0,
                                startAngle: 0,
                                endAngle: 360,
                                cx: 150,
                                cy: 150,
                            }
                            ]}
                        />
                    }
                </PieChartContainer>
            </DataContainer>
        </Chart>
        <Chart>
            <Title>Today</Title>
            <DataContainer>
                <LegendContainer>
                    <LegendRow>
                        <Indicator
                            color={chipVariant.open}/>
                        Open
                    </LegendRow>
                    <LegendRow>
                        <Indicator
                            color={chipVariant.closed}/>
                        Closed
                    </LegendRow>
                    <LegendRow>
                        <Indicator
                            color={chipVariant.inactive}/>
                        Past due
                    </LegendRow>
                </LegendContainer>
                <PieChartContainer>
                    {
                        chartIsLoading ?
                        <CircularProgress
                            size={'5rem'}/>:
                        chartIsError ?
                        <>
                            No data available
                        </> :
                        chart.today.total === 0 ?
                        <>
                            No data available
                        </> :
                        <PieChart
                            onItemClick={itemClickedToday}
                            slotProps = { {
                                legend: { hidden: true }
                            } }
                            series={[
                            {
                                data: [ 
                                    { 
                                        id: 0, 
                                        value: chart.today.open, 
                                        label: 'Open' ,
                                        color: chipVariant.open
                                    },
                                    { 
                                        id: 1, 
                                        value: chart.today.closed, 
                                        label: 'Closed' ,
                                        color: chipVariant.closed
                                    },
                                    { 
                                        id: 2, 
                                        value: chart.today.past_due, 
                                        label: 'Past due' ,
                                        color: chipVariant.inactive
                                    }
                                ],
                                innerRadius: 85,
                                outerRadius: 100,
                                paddingAngle: 0,
                                cornerRadius: 0,
                                startAngle: 0,
                                endAngle: 360,
                                cx: 150,
                                cy: 150,
                            }
                            ]}
                        />
                    }
                </PieChartContainer>
            </DataContainer>
        </Chart>
    </ChartContainer>
    <NotificationsContainer>
        <Title>Todays appointments</Title>
        <NotificationList>
        {
            appointmentIsLoading ? 
            <CircularProgress/>  :
            appointmentData?.length > 0 ?
            appointmentData.map((notification) => {
                return <Notification data={notification}/>
            }):
            <Typography
            sx={{
               cursor: 'default'
            }}>No appointments today</Typography>
            
        }
        </NotificationList>
    </NotificationsContainer>
    </>
}