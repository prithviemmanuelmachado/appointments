import { Box, styled } from "@mui/material"

const Body = styled(Box)(({theme}) => ({
    flexGrow: 1,
    width: '90%',
    display: 'flex',
    paddingBlock: '2vh',
    paddingInline: '5%',
    overflowX: 'hidden',
    overflowY: 'auto',
    flexDirection: 'column'
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