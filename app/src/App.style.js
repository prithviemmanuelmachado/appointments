import { Box, styled } from "@mui/material"

const Body = styled(Box)(({theme}) => ({
    height: '90vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflowX: 'hidden',
    overflowY: 'auto'
}))

const Header = styled(Box)(({theme}) => ({
    height: '10vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}))

export {
    Body,
    Header
}