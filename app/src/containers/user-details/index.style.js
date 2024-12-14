import { Box, styled, Typography } from "@mui/material"

const Row = styled(Box)(({theme}) => ({
    width: '100%',
    paddingBlock: '15px',
    display: 'flex',
    flexDirection: 'row',
    columnGap: '10px'
}))

const LabelContainer = styled(Box)(({theme}) => ({
    width: '30%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
}))

const DataContainer = styled(Box)(({theme}) => ({
    width: '70%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
}))

const Label = styled(Typography)(({theme}) => ({
    width: '30%'
}))

const Data = styled(Typography)(({theme}) => ({
    width: '70%'
}))

export {
    Row,
    Label,
    Data,
    LabelContainer,
    DataContainer
}