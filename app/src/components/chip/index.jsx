import { IconButton } from "@mui/material";
import { Container, CustomCloseOutlinedIcon, Label, Pill } from "./index.style";

/**
 * Chip Component
 * A reusable chip component that supports deleteing.
 *
 * @component
 *
 * @param {Object} props - The properties for the Chip component.
 * @param {string} props.label - The description on the chip.
 * @param {string} props.align - This aligns the chip to the parent container if the container stretches content. Same value as align-items in flex-box
 * @param {function} [props.onRemove] - Timestamp displayed as a subheader in the card.
 * @param {string} props.variant - The variant of the chip as per constants > chipVariant
 *
 * @example
 * const handleRemove = () => {
 *   console.log("Removed");
 * };
 *
 * <Chip
 *   label="Sample Title"
 *   align={"flex-start"}
 *   onRemove={handleRemove}
 *   variant={chipVariant.closed}
 * />
 * 
 * @returns {JSX.Element} A `Chip` commponent.
 */
export default function Chip(props){
    const {
        label,
        align,
        onRemove,
        variant
    } = props;

    return <Container align={align}>
        <Pill variant={variant}>
        <Label variant={variant}>
            {label}
        </Label>
        {
            onRemove &&
            <IconButton
                onClick={onRemove}
            >
                <CustomCloseOutlinedIcon variant={variant}/>
            </IconButton>
        }
        </Pill>
    </Container>
}