import { Box, styled } from "@mui/material"
import { blueGrey } from "@mui/material/colors"

const Container = styled(Box)(({theme}) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%'
}))

const Card = styled(Box)(({theme}) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '30%',
    borderRadius: 10,
    boxShadow: `5px 5px 5px ${blueGrey[400]}`,
    border: `2px solid ${theme.palette.primary.main}`,
    gap: '30px',
    padding: '30px',
    flexDirection: 'column'
}))

export {
    Container,
    Card
}