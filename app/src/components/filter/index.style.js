import { Box, styled } from "@mui/material"
import { glass } from "../../constants"

const Container = styled(Box)(({theme}) => ({
    padding: '0.5rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'column',
    flexGrow: 1,
    gap: 10,
    ...glass
}))

const ButtonContainer = styled(Box)(({theme}) => ({
    width: '100%',
    height: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}))

const LeftButtons = styled(Box)(({theme}) => ({
    width:'50%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
}))

const RightButtons = styled(Box)(({theme}) => ({
    width:'50%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '5%'
}))

const ChipContainer = styled(Box)(({theme}) => ({
    maxWidth:'75vw',
    height: '50%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    overflowX: 'auto', 
    whiteSpace: 'nowrap',
    gap: 10,
}))

export {
    Container,
    ButtonContainer,
    ChipContainer,
    LeftButtons,
    RightButtons
}