import { Box, styled } from "@mui/material";

const Container = styled(Box)(({theme, isLoggedin}) => ({
    display: 'flex',
    width: '100vw',
    height: '100vh',
    flexDirection: isLoggedin ? 'row' : 'column'
}))

const Body = styled(Box)(({theme, isLoggedin}) => ({
    flexGrow: 1,
    height: '100%',
    width: '98%',
    display: 'flex',
    paddingInline: '1%',
    overflowX: 'hidden',
    overflowY: 'auto',
    flexDirection: 'column',
    backgroundImage: 'url("/background.svg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center', 
    backgroundRepeat: 'no-repeat',
}))

const Header = styled(Box)(({theme, isLoggedin}) => ({
    height: isLoggedin ? '100%' : '10vh',
    width: isLoggedin ? '30vw' : '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}))

const ModalCard = styled(Box)(({theme}) => ({
    width: '60%',
    maxHeight: '90%',
    paddingBlock: '2%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    borderRadius: '10px',
    padding: '50px',
    backgroundColor: theme.palette.background.paper
}))

export {
    Body,
    Header,
    Container,
    ModalCard
}