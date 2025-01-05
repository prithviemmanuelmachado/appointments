import { IconButton } from "@mui/material";
import { Container, CustomCloseOutlinedIcon, Label, Pill } from "./index.style";

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