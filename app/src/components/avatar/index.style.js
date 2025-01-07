import { Avatar, styled } from "@mui/material"

const ProfileAvatar = styled(Avatar)(({theme, size}) => ({
    width: `${size}rem`,
    height: `${size}rem`,
    fontSize: `${size * 0.6}rem`
}))

export {
    ProfileAvatar
}