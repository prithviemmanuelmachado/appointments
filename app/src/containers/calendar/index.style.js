import { Box, styled, TableCell, Typography } from "@mui/material"

const Container = styled(Box)(({theme}) => ({
    padding: '5px',
    paddingBottom: '15px',
    display: 'flex',
    flexGrow: 1,
}))

const Cell = styled(TableCell)(({theme}) => ({
    minWidth: '100px',
    maxWidth: '100px'
}))

const Label = styled(Typography)(({theme}) => ({
    width: '100%',
    fontWeight: 'bold',
    textAlign: 'center',
    cursor: 'default',
    color: theme.palette.unfocused.main
}))

const SubLabel = styled(Typography)(({theme}) => ({
    width: '100%',
    textAlign: 'center',
    cursor: 'default',
    color: theme.palette.unfocused.main
}))

const ButtonCell = styled(TableCell)(({theme}) => ({
    minWidth: '20px',
    padding: 0
}))

export {
    Container,
    Cell,
    Label,
    SubLabel,
    ButtonCell
}