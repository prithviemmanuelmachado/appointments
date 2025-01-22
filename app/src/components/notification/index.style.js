import { Box, styled, Typography } from "@mui/material"
import { glass } from "../../constants"

const Container = styled(Box)(({theme}) => ({
    padding: '15px',
    display: 'flex',
    flexGrow: 1,
    boxShadow: `0 0 5px ${theme.palette.unfocused.main}`,
    flexDirection: 'column',
    gap: '10px',
    cursor: 'pointer',
    width: '98%',
    ...glass
}))

const Title = styled(Typography)(({theme}) => ({
    fontSize: '1.2rem',
    fontWeight: 'bold'
}))

const Footer = styled(Box)(({theme}) => ({
    height: '50px',
    display: 'flex',
    [theme.breakpoints.down('md')]:{
        flexDirection: 'column',
        paddingBlockEnd: '2rem',
        gap: '1rem'
    }
}))

const Right = styled(Box)(({theme}) => ({
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '30px',
    [theme.breakpoints.down('md')]:{
        justifyContent: 'flex-start',
    }
}))

const Left = styled(Box)(({theme}) => ({
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: '30px'
}))

export {
    Container,
    Title,
    Footer,
    Right,
    Left
}