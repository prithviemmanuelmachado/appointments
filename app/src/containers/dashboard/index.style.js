import { Box, styled, Typography } from "@mui/material";
import { glass } from "../../constants";

const ChartContainer = styled(Box)(({theme}) => ({
    paddingInline: '15px',
    display: 'flex',
    height: '50%',
    width: '100%',
    gap: '1rem'
}))

const NotificationsContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    height: '50%',
    flexDirection: 'column',
    gap: '10px'
}))

const NotificationList = styled(Box)(({theme}) => ({
    overflowY: 'auto',
    overflowX: 'hidden',
    display: 'flex',
    flexGrow: 1,
    paddingBlock: '15px',
    gap: '30px',
    flexDirection: 'column',
    paddingInline: '15px',
    alignItems: 'center'
}))

const Chart = styled(Box)(({theme}) => ({
    padding: '15px',
    display: 'flex',
    height: '90%',
    width: '46%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'column',
    ...glass
}))

const Title = styled(Typography)(({theme}) => ({
    width: '100%',
    fontSize: '1.2rem',
    color: theme.palette.primary.main,
    cursor: 'default',
    fontWeight: 'bold',
}))

const DataContainer = styled(Box)(({theme}) => ({
    width: '100%',
    display: 'flex',
    flexGrow: 1,
}))

const LegendContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    width: '40%',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '30px',
    height: '100%',
}))

const PieChartContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '60%',
}))

const LegendRow = styled(Box)(({theme}) => ({
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: '10px',
    cursor: 'default'
}))

const Indicator = styled(Box)(({theme, color}) => ({
    height: '20px',
    width: '20px',
    backgroundColor: color
}))

export {
    ChartContainer,
    NotificationsContainer,
    Chart,
    Title,
    LegendContainer,
    LegendRow,
    Indicator,
    PieChartContainer,
    NotificationList,
    DataContainer
}