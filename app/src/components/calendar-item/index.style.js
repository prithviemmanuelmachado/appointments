import { Box, styled, Typography } from "@mui/material"
import { glass } from "../../constants"

const Container = styled(Box)(({theme, isLast, isFirst}) => ({
    width: '100%',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    marginTop: !isFirst && '10px',
    marginBottom: !isLast && '10px',
    padding: '3px',
    boxShadow: `0 0 5px ${theme.palette.unfocused.main}`,
    borderRadius: '5px',
    cursor: 'pointer',
    ...glass
}))

const Profile = styled(Typography)(({theme}) => ({
    fontSize: 16,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
}))

export {
    Profile,
    Container
}