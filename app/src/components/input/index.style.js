import { Box, FormHelperText, styled, Typography } from "@mui/material"

const Label = styled(Typography)(({theme}) => ({
    fontSize: 14,
    marginBottom: 4,
    color: theme.palette.grey[700]
}))

const FileLabel = styled(Typography)(({theme, isSelected}) => ({
    cursor: 'default',
    fontSize: 14,
    overflow: 'hidden', 
    textOverflow: 'ellipsis', 
    whiteSpace: 'nowrap',
    maxWidth: '40%',
    color: isSelected ? theme.palette.text : theme.palette.grey[700]
}))

const Row = styled(Box)(({theme}) => ({
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: '10px'
}))

const ErrorHelperText = styled(FormHelperText)(({theme}) => ({
    color: theme.palette.error.main
}))

export {
    Label,
    ErrorHelperText,
    FileLabel,
    Row
}