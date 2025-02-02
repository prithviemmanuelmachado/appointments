import { Box, styled } from "@mui/material"
import { glass } from "../../constants"

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
    gap: '30px',
    padding: '30px',
    flexDirection: 'column',
    ...glass
}))

export {
    Container,
    Card
}