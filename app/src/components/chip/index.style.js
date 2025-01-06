import { Box, styled, Typography } from "@mui/material"
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

const Container = styled(Box)(({theme, align}) => ({
    display: 'flex',
    justifyContent: align,
}));

const Pill = styled(Box)(({theme, variant}) => ({
    display: 'flex',
    paddingBlock: '3px',
    paddingInline: '10px',
    border: `2px solid ${variant}`,
    gap: '5px',
    borderRadius: 5,
    alignItems: 'center'
}));

const Label = styled(Typography)(({theme, variant}) => ({
    color: variant
}));

const CustomCloseOutlinedIcon = styled(CloseOutlinedIcon)(({theme, variant}) => ({
    width: '15px',
    height: '15px',
    color: variant
}))

export{
    Container,
    Label,
    CustomCloseOutlinedIcon,
    Pill
}