import { Box, styled } from "@mui/material"

const Contianer = styled(Box)(({theme}) => ({
    width: '90%',
    paddingInline: '5%',
    display: 'flex',
    flexDirection: 'column'
}))

export {
    Contianer
}