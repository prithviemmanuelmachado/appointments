import { Box, styled } from "@mui/material"

const Container = styled(Box)(({theme}) => ({
    padding: '5px',
    paddingBottom: '15px',
    display: 'flex',
    flexGrow: 1,
}))

export {
    Container
}