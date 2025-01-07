import { Button } from "@mui/material";
import ModalForm from "../modal-form";
import { ButtonContainer, ChipContainer, Container, LeftButtons, RightButtons } from "./index.style";
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import Chip from "../chip";
import { chipVariant } from "../../constants";

/**
 * Filter Component
 * 
 * A reusable component for applying filters with a modal form, reset functionality, and displaying active filter chips.
 * 
 * @component
 * 
 * @param {Object} props - Component props.
 * @param {React.ReactNode} [props.leftButton] - Optional content to render on the left side of the filter toolbar.
 * @param {Function} props.onFilter - Callback function triggered when the filter form is submitted. Receives filter data.
 * @param {Function} [props.onReset] - Optional callback function triggered when the reset button is clicked.
 * @param {Array<Object>} props.filterForm - The configuration for the filter modal form. Each object represents a form field.
 * @param {Function} [props.onFilterClose] - Optional callback function triggered when the filter modal is closed.
 * @param {Object} props.filters - Object containing the active filters to display as chips. Each key is a filter name.
 * @param {Object} props.filters[].value - The value of the filter to display.
 * @param {string} props.filters[].lookup - A description or lookup value to display alongside the filter value.
 * @param {Function} props.filters[].onRemove - Callback function triggered when the chip's remove button is clicked.
 * 
 * @example
 * const filters = {
 *   "#": {
 *     value: "123",
 *     lookup: "",
 *     onRemove: () => console.log("Removed ID filter"),
 *   },
 *   "Date": {
 *     value: "12 Jan, 2024",
 *     lookup: "greater than",
 *     onRemove: () => console.log("Removed Date filter"),
 *   },
 * };
 * 
 * const filterForm = [
 *   { label: "ID", type: "text" },
 *   { label: "Date", type: "date" },
 * ];
 * 
 * const handleFilter = (data) => {
 *   console.log("Filter applied with data:", data);
 * };
 * 
 * const handleReset = () => {
 *   console.log("Filters reset");
 * };
 * 
 * <Filter
 *   leftButton={<Button>Custom Button</Button>}
 *   onFilter={handleFilter}
 *   onReset={handleReset}
 *   filterForm={filterForm}
 *   onFilterClose={() => console.log("Filter modal closed")}
 *   filters={filters}
 * />
 * 
 * @returns {JSX.Element} A `Filter` component.
 */
export default function Filter(props){
    const {
        leftButton,
        onFilter,
        onReset,
        filterForm,
        onFilterClose,
        filters
    } = props;

    return <Container>
        <ButtonContainer>
            <LeftButtons>
            {leftButton}
            </LeftButtons>
            <RightButtons>
                {
                    onReset &&
                    <Button
                        onClick={onReset}
                        color="error"
                        variant="outlined">
                        <ClearOutlinedIcon/>
                    </Button>
                }
                {
                    filterForm &&
                    onFilter &&
                    <ModalForm
                        buttonIcon={<FilterListOutlinedIcon/>}
                        buttonVariant="outlined"
                        formFields={filterForm}
                        onFormClose={onFilterClose}
                        onSubmit={onFilter}/>
                }
            </RightButtons>
        </ButtonContainer>
        <ChipContainer>
        {
            Object.keys(filters).map((key, index) => {
                const filter = filters[key];
                return <Chip
                        label={`${key}: ${filter.lookup} ${filter.value}`}
                        variant={chipVariant.primary}
                        onRemove={filter.onRemove}/>
            })
        }
        </ChipContainer>
    </Container>
}