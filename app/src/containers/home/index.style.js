import { Box, styled, Typography } from "@mui/material"
import { indigo } from "@mui/material/colors"

const Container = styled(Box)(({theme}) => ({
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'column',
    padding: 0
}))

const Row = styled(Box)(({theme, leftToRight}) => ({
    width: '95%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',   
    background: `linear-gradient(-45deg, ${leftToRight ? indigo[50] : indigo[400]}33, ${leftToRight ? indigo[400] : indigo[50]}33)`, // Semi-transparent background
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', // Subtle shadow
    backdropFilter: 'blur(10px)', // Blur the background behind
    WebkitBackdropFilter: 'blur(10px)', // Safari support
    border: '1px solid rgba(255, 255, 255, 0.3)' , // Border for definition
    marginBlock: '5%',
    borderRadius: '1rem',
    paddingBlock: '1rem',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column'
    }
}))

const TextContainer = styled(Box)(({theme}) => ({
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingInline: '2%',
    flexDirection: 'column',
    gap: '1rem'
}))

const Title = styled(Typography)(({theme}) => ({
    fontSize: '2.2rem',
    color: theme.palette.primary.main,
    fontWeight: 'bolder',
    textTransform: 'uppercase',
    cursor: 'default',
    fontFamily: "'Domine', serif"
}))

const Body = styled(Typography)(({theme}) => ({
    cursor: 'default'    
}))

const SubTitle = styled(Typography)(({theme}) => ({
    fontSize: '2.4rem',
    fontWeight: 'bolder',
    cursor: 'default',
    fontFamily: "'Domine', serif"
}))

export {
    Container,
    TextContainer,
    Title,
    Body,
    SubTitle,
    Row
}