import { Box, styled, TableCell, Typography } from "@mui/material"

const HeaderCell = styled(TableCell)(({theme}) => ({
    backgroundColor: theme.palette.primary.light,
    paddingInline: '2%',
    verticalAlign: 'top', 
    display: 'table-cell', 
}))

const ButtonRow = styled(TableCell)(({theme}) => ({
    backgroundColor: theme.palette.primary.light,
}))

const HeaderLabel = styled(Typography)(({theme}) => ({
    fontSize: 16
}))

const FilterContainer = styled(Box)(({theme}) => ({

}))

const SortContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'row'
}))

const SortItem = styled(Box)(({theme}) => ({
    width: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}))

export {
    HeaderCell,
    FilterContainer,
    HeaderLabel,
    SortContainer,
    SortItem,
    ButtonRow
}