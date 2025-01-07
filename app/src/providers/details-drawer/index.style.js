import { Box, styled } from "@mui/material"

const Contianer = styled(Box)(({theme}) => ({
    width: '50vw',
    paddingInline: '10px',
    display: 'flex',
    flexDirection: 'column'
}))

export {
    Contianer
}