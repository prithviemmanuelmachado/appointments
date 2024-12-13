import { Box, styled, Typography } from "@mui/material"

const ErrorTitle = styled(Typography)(({theme}) => ({
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: '1%'
}))

const Container = styled(Box)(({theme}) => ({
    width: '100vw',
    height: '100vh',
    backgroundColor: theme.palette.primary.light
}))

const ErrorContainer = styled(Box)(() => ({
    padding: '10%',
}))

export {
    ErrorTitle,
    ErrorContainer,
    Container
}