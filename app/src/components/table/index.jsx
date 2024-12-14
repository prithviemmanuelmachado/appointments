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
import { ButtonRow, DataRow, FilterContainer, HeaderCell, HeaderLabel, SortContainer, SortItem } from "./index.style";
import { inputTypes } from "../../constants";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

/**
 * PaginationTable Component
 * 
 * A reusable table component with filtering, sorting, and pagination functionality using Material-UI.
 * 
 * @component
 * 
 * @param {Object} props - Component props
 * @param {Object} props.headers - Table headers configuration. Each key represents a column with its properties.
 * @param {string} props.headers[].label - The display label of the column.
 * @param {string} props.headers[].align - Text alignment for the column ("left", "center", "right").
 * @param {number} [props.headers[].width] - Optional width of the column.
 * @param {boolean} [props.headers[].canSort] - Indicates if the column is sortable.
 * @param {Object} props.headers[].input - Configuration for column filters.
 * @param {string} props.headers[].input.type - Type of filter input (limited to inputTypes.date, inputTypes.time, inputTypes.text).
 * @param {any} props.headers[].input.value - Current value of the filter.
 * @param {Function} props.headers[].input.setValue - Function to update the filter value.
 * @param {Array} [props.headers[].input.options] - Options for select input, if applicable.
 * 
 * @param {Array<Object>} props.data - Data to populate the table rows. Each object represents a row.
 * @param {number} props.pageNumber - Current page number (zero-based).
 * @param {Function} props.setPageNumber - Function to update the current page number.
 * @param {number} props.totalCount - Total number of items in the dataset.
 * @param {Function} props.onFilter - Callback function triggered when the "Search" button is clicked.
 * @param {Function} props.onReset - Callback function triggered when the "Reset" button is clicked.
 * @param {Function} props.onSortAsc - Callback function triggered when ascending sort is applied. Receives column key.
 * @param {Function} props.onSortDesc - Callback function triggered when descending sort is applied. Receives column key.
 * @param {Array<string>} props.sortList - List of active sort keys. A key with a `-` prefix indicates descending sort.
 * @param {Function} props.onRowClick - Callback function triggered when data row is clicked
 * 
 * @example
 * const headers = {
 *   column_1: {
 *     label: "Column 1",
 *     align: "left",
 *     canSort: true,
 *     input: { type: "text", value: "", setValue: (event) => console.log(event.target.value) }
 *   },
 *   column_2: {
 *     label: "Column 2",
 *     align: "center",
 *     input: { type: "select", value: "Option 1", options: [{ label: "Option 1", value: 1 }], setValue: () => {} }
 *   }
 * };
 * const data = [
 *   { column_1: "Row 1 Col 1", column_2: "Row 1 Col 2" },
 *   { column_1: "Row 2 Col 1", column_2: "Row 2 Col 2" }
 * ];
 * 
 * const onClick = (data) => {
 *  
 * } 
 * 
 * <PaginationTable
 *   headers={headers}
 *   data={data}
 *   pageNumber={0}
 *   setPageNumber={(newPage) => console.log(newPage)}
 *   totalCount={20}
 *   onFilter={() => console.log("Filter applied")}
 *   onReset={() => console.log("Filters and Sort reset")}
 *   onSortAsc={(key) => console.log(`Ascending sort applied on ${key}`)}
 *   onSortDesc={(key) => console.log(`Descending sort applied on ${key}`)}
 *   sortList={["column_1", "-column_2"]
 *   onRowClick={onClick}}
 * />
 * @returns {JSX.Element} A `Table` commponent.
 */
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
        sortList,
        onRowClick
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
                        return <DataRow
                            clickable={onRowClick}
                            onClick={() => onRowClick(item)}
                            key={`row-${item[keys[0]]}-${iindex}`}>
                            {
                                keys.map((key, kindex) => {
                                    return <TableCell
                                        sx={{
                                            paddingInline: '2%',
                                            cursor: 'inherit'
                                        }}
                                        key={`row-${key}-${iindex}-${kindex}`}
                                        align={headers[key].align}
                                        width={headers[key].width}>
                                        {item[key] ?? '---'}
                                    </TableCell>
                                })
                            }
                        </DataRow>
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