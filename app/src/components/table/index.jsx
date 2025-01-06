import { 
    TableContainer, 
    Table, 
    TableHead, 
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    TablePagination
} from "@mui/material";
import { DataRow, HeaderCell, HeaderItem, HeaderLabel, SortContainer, SortItem } from "./index.style";
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
 *   },
 *   column_2: {
 *     label: "Column 2",
 *     align: "center",
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
        onSortAsc,
        onSortDesc,
        sortList,
        onRowClick
    } = props;

    const keys = Object.keys(headers);

    return <>
    <TableContainer
        sx={{
            maxHeight: '75%',
            minHeight: '75%'
        }}>
        <Table
            stickyHeader={true}
            aria-label="sticky table">
            <TableHead>
                <TableRow>
                    {keys.map((key, index) => {
                        const column = headers[key]
                        return <HeaderCell
                        key={`table-${column.lable}-${index}`}
                        align={column.align}
                        cwidth={column.width}
                        >
                            <HeaderItem align={column.align}>
                                <HeaderLabel>
                                {column.label}
                                </HeaderLabel>
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
                            </HeaderItem>
                        </HeaderCell>
                    })}
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
                                            cursor: 'inherit',
                                            minWidth: headers[key].width
                                        }}
                                        key={`row-${key}-${iindex}-${kindex}`}
                                        align={headers[key].align}>
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