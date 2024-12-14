import { Box, Button, styled, Typography } from "@mui/material"

const Container = styled(Box)(({theme}) => ({
    backgroundColor: theme.palette.primary.light,
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}))

const Left = styled(Box)(({theme}) => ({
    height: '100%',
    width: '44%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingInline: '3%'
}))

const Right = styled(Box)(({theme}) => ({
    height: '100%',
    width: '44%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingInline: '3%',
    columnGap: '10px'
}))

const Title = styled(Typography)(({theme}) => ({
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.palette.primary.main
}))

const Profile = styled(Typography)(({theme}) => ({
    fontSize: 16,
}))

const PageLink = styled(Button)(({theme, isSelected}) => ({
    fontSize: 16,
    textTransform: "none"
}))

export {
    Container,
    Right,
    Left,
    Title,
    Profile,
    PageLink
}