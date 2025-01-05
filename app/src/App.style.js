import { Box, styled } from "@mui/material"

const Container = styled(Box)(({theme, isLoggedin}) => ({
    display: 'flex',
    width: '100vw',
    height: '100vh',
    flexDirection: isLoggedin ? 'row' : 'column'
}))

const Body = styled(Box)(({theme, isLoggedin}) => ({
    flexGrow: 1,
    height: '100%',
    width: isLoggedin ? '98%' : '95%',
    display: 'flex',
    paddingInline: '1%',
    overflowX: 'hidden',
    overflowY: 'auto',
    flexDirection: 'column',
}))

const Header = styled(Box)(({theme, isLoggedin}) => ({
    height: isLoggedin ? '100%' : '10vh',
    width: isLoggedin ? '30vw' : '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}))

export {
    Body,
    Header,
    Container
}