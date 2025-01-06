import { Box, styled, TableCell, TableRow, Typography } from "@mui/material"

const HeaderCell = styled(TableCell)(({theme, cwidth, align}) => ({
    backgroundColor: theme.palette.primary.light,
    minWidth: cwidth,
    alignItems: align
}))

const ButtonRow = styled(TableCell)(({theme}) => ({
    backgroundColor: theme.palette.primary.light,
}))

const HeaderItem = styled(Box)(({theme, align}) => ({
    display: 'flex',
    height: '50px',
    alignItems: 'center',
    justifyContent: align === 'right' ? 'flex-end' :
                    align === 'center' ? 'center' : 'flex-start'
}))

const HeaderLabel = styled(Typography)(({theme}) => ({
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.palette.unfocused.main,
    cursor: 'default'
}))

const SortContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
}))

const SortItem = styled(Box)(({theme}) => ({
    height: '30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}))

const DataRow = styled(TableRow)(({theme, clickable}) => ({
    cursor: clickable ? 'pointer' : 'default',
    ':hover': {
        backgroundColor: clickable && theme.palette.primary.light
    }
}))

export {
    HeaderCell,
    HeaderLabel,
    SortContainer,
    SortItem,
    ButtonRow,
    DataRow,
    HeaderItem
}