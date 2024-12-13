import { 
    TableContainer, 
    Table, 
    TableHead, 
    TableRow,
    TableCell,
    TableBody,
    TextField,
    Select,
    MenuItem,
    FormControl,
    IconButton,
    Button,
    TablePagination
} from "@mui/material";
import { ButtonRow, FilterContainer, HeaderCell, HeaderLabel, SortContainer, SortItem } from "./index.style";
import { inputTypes } from "../../constants";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function PaginationTable(props){
    const {
        headers,
        data,
        pageNumber,
        setPageNumber,
        totalCount,
        onFilter,
        onReset,
        onSortAsc,
        onSortDesc,
        sortList
    } = props;

    const keys = Object.keys(headers);

    return <>
    <TableContainer>
        <Table 
            size="small"
            stickyHeader 
            aria-label="sticky table">
            <TableHead>
                <TableRow>
                    {keys.map((key, index) => {
                        const column = headers[key]
                        return <HeaderCell
                        key={`table-${column.lable}-${index}`}
                        align={column.align}
                        width={column.width}
                        >
                            <HeaderLabel>
                            {column.label}
                            </HeaderLabel>
                            <FilterContainer>
                                {
                                    column.input.type === inputTypes.text &&
                                    <TextField
                                        size={'small'}
                                        sx={{
                                            width: '96%'
                                        }}
                                        value = {column.input.value}
                                        onChange={column.input.setValue}
                                        variant="outlined" />
                                }
                                {
                                    column.input.type === inputTypes.select &&
                                    <FormControl
                                    sx={{ width: '96%' }}
                                    variant="outlined"
                                    size="small"
                                    >
                                    <Select
                                    value={column.input.value}
                                    onChange={column.input.setValue}
                                    >
                                    {
                                        column.input.options.map((option, index) => {
                                            return(
                                                <MenuItem 
                                                    key={`option-${option.label}-${index}`} 
                                                    value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            );
                                        })
                                    }
                                    </Select>
                                    </FormControl>
                                }
                                {
                                    column.input.type === inputTypes.date &&
                                    <DatePicker
                                        slotProps={{ textField: { size: 'small' } }}
                                        sx={{width: '96%'}}
                                        variant='outlined'
                                        value={column.input.value}
                                        format="DD MMM, YYYY"
                                        onChange={column.input.setValue}/>
                                }
                                {
                                    column.input.type === inputTypes.time &&
                                    <TimePicker
                                        sx={{width: '96%'}}
                                        variant='outlined'
                                        value={column.input.value}
                                        onChange={column.input.setValue}/>
                                }
                                {
                                    column.canSort &&
                                    <SortContainer>
                                        <SortItem>
                                            <IconButton
                                                aria-label={`asc-sort-${key}`}
                                                onClick={() => onSortAsc(key)}
                                            >
                                                <ArrowDropUpIcon 
                                                    color={sortList.includes(key) ? 'primary' : 'disabled'}/>
                                            </IconButton>
                                        </SortItem>
                                        <SortItem>
                                            <IconButton
                                                aria-label={`desc-sort-${key}`}
                                                onClick={() => onSortDesc(key)}
                                            >
                                                <ArrowDropDownIcon 
                                                    color={sortList.includes(`-${key}`) ? 'primary' : 'disabled'}/>
                                            </IconButton>
                                        </SortItem>
                                    </SortContainer>
                                }
                            </FilterContainer>
                        </HeaderCell>
                    })}
                </TableRow>
                <TableRow>
                    <ButtonRow colSpan={keys.length} align="right">
                        <Button 
                            onClick={onReset}
                            sx={{
                                marginInline: '3px'
                            }}
                            color="error" 
                            variant="contained">
                            Reset
                        </Button>
                        <Button 
                            onClick={onFilter}
                            sx={{
                                marginInline: '3px'
                            }}
                            variant="contained">
                            Search
                        </Button>
                    </ButtonRow>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    data.map((item, iindex) => {
                        return <TableRow key={`row-${item[keys[0]]}-${iindex}`}>
                            {
                                keys.map((key, kindex) => {
                                    return <TableCell
                                        key={`row-${key}-${iindex}-${kindex}`}
                                        align={headers[key].align}
                                        width={headers[key].width}>
                                        {item[key] ?? '---'}
                                    </TableCell>
                                })
                            }
                        </TableRow>
                    })
                }
            </TableBody>
        </Table>
    </TableContainer>
    <TablePagination
        component="div"
        count={totalCount}
        rowsPerPage={10}
        page={pageNumber}
        onPageChange={(event, newPage) => setPageNumber(newPage)}
        rowsPerPageOptions={[]}
        labelDisplayedRows={({ page }) => `Page ${page + 1}`}
    />
    </>
}