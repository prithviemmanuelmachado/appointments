import { Box, styled, Typography } from "@mui/material"

const Row = styled(Box)(({theme, sticky}) => ({
    width: '100%',
    paddingBlock: '15px',
    display: 'flex',
    flexDirection: 'row',
    columnGap: '10px',
    position: sticky && 'sticky',
    top: 0,
    backgroundColor: sticky && '#FFFFFF',
    zIndex: sticky && 3
}))

const LabelContainer = styled(Box)(({theme, top}) => ({
    width: '30%',
    paddingInline: 10,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: top ? 'flex-start' : 'center',
}))

const DataContainer = styled(Box)(({theme, top}) => ({
    width: '70%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: top ? 'flex-start' : 'center',
}))

const Label = styled(Typography)(({theme}) => ({
    cursor: 'default'
}))

const Data = styled(Typography)(({theme}) => ({
    cursor: 'default'
}))

const Title = styled(Typography)(({theme}) => ({
    flexGrow: 1,
    fontSize: '1.2rem',
    fontWeight: 'bold',
    cursor: 'default'
}))

export {
    Row,
    Label,
    Data,
    LabelContainer,
    DataContainer,
    Title
}