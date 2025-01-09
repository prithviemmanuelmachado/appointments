import { Box, styled, Typography } from "@mui/material"

const Container = styled(Box)(({theme}) => ({
    padding: '15px',
    display: 'flex',
    flexGrow: 1,
    boxShadow: `5px 5px 5px ${theme.palette.unfocused.main}`,
    borderRadius: 10,
    flexDirection: 'column',
    gap: '10px',
    cursor: 'pointer'
}))

const Title = styled(Typography)(({theme}) => ({
    fontSize: '1.2rem',
    fontWeight: 'bold'
}))

const Footer = styled(Box)(({theme}) => ({
    height: '50px',
    display: 'flex'
}))

const Right = styled(Box)(({theme}) => ({
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '30px'
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