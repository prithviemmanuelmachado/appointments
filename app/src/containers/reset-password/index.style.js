import { Box, styled } from "@mui/material"

const Container = styled(Box)(({theme}) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%'
}))

const Card = styled(Box)(({theme}) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '30%',
    borderRadius: 10,
    boxShadow: `0 0 5px ${theme.palette.unfocused.main}`,
    border: `2px solid ${theme.palette.primary.main}`,
    gap: '30px',
    padding: '30px',
    flexDirection: 'column'
}))

export {
    Container,
    Card
}