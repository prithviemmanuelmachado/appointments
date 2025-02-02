import { Avatar, Box, Button, styled, Typography } from "@mui/material"
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import ListOutlinedIcon from '@mui/icons-material/ListOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DonutLargeOutlinedIcon from '@mui/icons-material/DonutLargeOutlined';

const Container = styled(Box)(({theme, isLoggedin, isMobile}) => ({
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: isLoggedin && !isMobile ? 'column' : 'row',
    borderRight: isLoggedin && `${theme.palette.primary.main} 2px solid`,
    borderBottom: !isLoggedin && `${theme.palette.primary.main} 2px solid`
}))

const Logo = styled(Box)(({theme}) => ({
    height: '50px',
    width: '50px',
    backgroundImage: 'url("/logo.svg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center', 
    backgroundRepeat: 'no-repeat',
}))

const Left = styled(Box)(({theme}) => ({
    width: '44%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingInline: '3%',
    [theme.breakpoints.down('md')]: {
        width: '70%',
    },
    [theme.breakpoints.up('md')]: {
        width: '44%',
    }
}))

const Right = styled(Box)(({theme}) => ({
    height: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingInline: '3%',
    columnGap: '10px',
    [theme.breakpoints.down('md')]: {
        width: '25%',
    },
    [theme.breakpoints.up('md')]: {
        width: '44%',
    }
}))

const Header = styled(Box)(({theme}) => ({
    height: '25%',
    width: '90%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'column',
    gap: '15px'
}))

const Footer = styled(Box)(({theme}) => ({
    height: '20%',
    width: '90%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'column',
    paddingInline: '5%',
    gap: '20px'
}))

const Row = styled(Box)(({theme}) => ({
    width: '100%',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
        width: '90%',
        paddingInline: '5%',
        paddingBlock: '10%'
    },
}))

const Body = styled(Box)(({theme}) => ({
    flexGrow: 1,
    width: '90%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    columnGap: '10px',
    flexDirection: 'column',
    paddingInline: '5%'
}))

const Title = styled(Typography)(({theme}) => ({
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: theme.palette.primary.main
}))

const PageLabel = styled(Typography)(({theme, isSelected}) => ({
    fontSize: 16,
    color: isSelected ? theme.palette.primary.contrastText : theme.palette.primary.main
}))

const CustomManageAccountsIcon = styled(ManageAccountsOutlinedIcon)(({theme, isSelected}) => ({
    color: isSelected ? theme.palette.primary.contrastText : theme.palette.primary.main
}))

const CustomCalendarMonthIcon = styled(CalendarMonthIcon)(({theme, isSelected}) => ({
    color: isSelected ? theme.palette.primary.contrastText : theme.palette.primary.main
}))

const CustomDonutLargeOutlinedIcon = styled(DonutLargeOutlinedIcon)(({theme, isSelected}) => ({
    color: isSelected ? theme.palette.primary.contrastText : theme.palette.primary.main
}))

const CustomListOutlinedIcon = styled(ListOutlinedIcon)(({theme, isSelected}) => ({
    color: isSelected ? theme.palette.primary.contrastText : theme.palette.primary.main
}))

const Profile = styled(Typography)(({theme}) => ({
    cursor: 'default',
    fontSize: 16,
}))

const HeaderLink = styled(Button)(({theme}) => ({
    textTransform: "none",
    borderRadius: 0,
    paddingInline: 0
}))

const PageLink = styled(Button)(({theme, isSelected}) => ({
    textTransform: "none",
    borderRadius: 0,
    width: '100%',
    height: '15%',
    backgroundColor: isSelected && theme.palette.primary.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '10px'
}))

const Version = styled(Typography)(({theme}) => ({
    fontSize: 14,
    color: theme.palette.grey[500],
    cursor: 'default'
}))

const ProfileAvatar = styled(Avatar)(({theme}) => ({
    width: '1.8rem',
    height: '1.8rem',
    fontSize: '1.1rem'
}))

export {
    Container,
    Right,
    Left,
    Title,
    Profile,
    PageLink,
    Header,
    Footer,
    Body,
    Version,
    Row,
    ProfileAvatar,
    HeaderLink,
    PageLabel,
    CustomManageAccountsIcon,
    CustomListOutlinedIcon,
    CustomDonutLargeOutlinedIcon,
    Logo,
    CustomCalendarMonthIcon
}