import { Box, styled, Typography } from "@mui/material"

const Container = styled(Box)(({theme}) => ({
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
}))

const TextContainer = styled(Box)(({theme}) => ({
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingInline: '2%',
    flexDirection: 'column'
}))

const Title = styled(Typography)(({theme}) => ({
    fontSize: 24,
    color: theme.palette.primary.main,
    fontWeight: 'bold'
}))

const Body = styled(Typography)(({theme}) => ({

}))

export {
    Container,
    TextContainer,
    Title,
    Body
}