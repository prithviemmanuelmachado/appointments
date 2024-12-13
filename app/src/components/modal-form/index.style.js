import { Box, FormHelperText, styled, Typography } from "@mui/material"

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
    borderBottom: `3px solid ${theme.palette.primary.light}`
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
    borderTop: `3px solid ${theme.palette.primary.light}`
}))

const Container = styled(Box)(({theme}) => ({
    width: '60%',
    height: '90%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'column',
    borderRadius: '10px',
    backgroundColor: theme.palette.background.paper
}))

const InputContainer = styled(Box)(({theme}) => ({
    width: '100%',
    display: 'flex',
    paddingInline: '2%',
    paddingBlock: '1%',
    flexDirection: 'column'
}))

const Label = styled(Typography)(({theme}) => ({
    fontSize: 14,
    marginBottom: 4,
    color: theme.palette.grey[700]
}))

const ErrorHelperText = styled(FormHelperText)(({theme}) => ({
    color: theme.palette.error.main
}))

export {
    Title,
    Container,
    TitleContainer,
    FormContainer,
    ButtonContainer,
    Header,
    InputContainer,
    Label,
    ErrorHelperText
}