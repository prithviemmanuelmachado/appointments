import { Box, FormHelperText, Link, styled, Typography } from "@mui/material"

const Title = styled(Typography)(({theme}) => ({
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.palette.primary.main,
}))

const Header = styled(Box)(({theme}) => ({
    height: '10%',
    width: '94%',
    display: 'flex',
    alignItems: 'center',
    paddingInline: '3%',
    borderBottom: `3px solid ${theme.palette.primary.light}`,
    cursor: 'default',
    paddingBlockEnd: '3%'
}))

const TitleContainer = styled(Box)(({theme}) => ({
    height: '100%',
    width: '90%',
    display: 'flex',
    alignItems: 'center',
}))

const FormContainer = styled(Box)(({theme}) => ({
    width: '100%',
    height: '80%',
    overflowY: 'auto',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column'
}))

const ButtonContainer = styled(Box)(({theme}) => ({
    width: '90%',
    paddingInline: '5%',
    paddingTop: '2%',
    display: 'flex',
    justifyContent: 'flex-end',
    borderTop: `3px solid ${theme.palette.primary.light}`,
    paddingBlockStart: '3%'
}))

const LinkContainer = styled(Box)(({theme}) => ({
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center'
}))

const Container = styled(Box)(({theme, narrow }) => ({
    maxHeight: '90%',
    paddingBlock: '2%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'column',
    borderRadius: '10px',
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.down('md')]: {
        width: '90%',
    },
    [theme.breakpoints.up('md')]: {
        width: narrow ? '40%' : '60%',
    },
}))

const InputContainer = styled(Box)(({theme, width, isRow, noPadding}) => ({
    width: width ?? '100%',
    display: 'flex',
    alignItems: isRow && 'flex-end',
    paddingInline: noPadding ? 0 : '2%',
    paddingInlineEnd: noPadding && '2%',
    paddingBlock: '1%',
    flexDirection: isRow ? 'row' : 'column'
}))

export {
    Title,
    Container,
    TitleContainer,
    FormContainer,
    ButtonContainer,
    Header,
    LinkContainer,
    InputContainer
}