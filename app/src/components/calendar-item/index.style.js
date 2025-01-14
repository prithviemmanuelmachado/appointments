import { Box, styled, Typography } from "@mui/material"

const Container = styled(Box)(({theme, isLast, isFirst}) => ({
    width: '100%',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    marginTop: !isFirst && '10px',
    marginBottom: !isLast && '10px',
    padding: '3px',
    boxShadow: `5px 5px 5px ${theme.palette.unfocused.main}`,
    borderRadius: '3px',
    cursor: 'pointer'
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