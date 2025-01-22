import { 
    Body, 
    Container, 
    CustomDonutLargeOutlinedIcon, 
    CustomListOutlinedIcon, 
    CustomManageAccountsIcon, 
    Footer, 
    Header, 
    HeaderLink, 
    Left, 
    Logo, 
    PageLabel, 
    PageLink, 
    Profile, 
    Right, 
    Row, 
    Title, 
    Version,
    CustomCalendarMonthIcon 
} from "./index.style";
import { Button, Drawer, IconButton, Link as MUILink, useMediaQuery } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { clearProfile } from "../../store/profileSlice";
import { useLocation, Link, useNavigate } from 'react-router';
import Login from "../login";
import Signup from "../signup";
import { avatarSize } from "../../constants";
import Avatar from "../../components/avatar";
import { raiseError, updateToast } from "../../store/toastSlice";
import ApiService from "../../services/apiservice";
import { useQueryClient } from "@tanstack/react-query";
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { useState } from "react";

export default function NavBar(props){
    const navigate = useNavigate()
    const profile = useSelector(state => state.profile);
    const location = useLocation();
    const queryClient = useQueryClient();
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'))
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const dispatch = useDispatch();

    const handleLogout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('email');
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
        localStorage.removeItem('isStaff');
        dispatch(clearProfile());
        queryClient.invalidateQueries();
        navigate('/', { replace: true });
    }

    const getActiveRoute = (path) => {
        return location.pathname.includes(path);
    }

    const resetPassword = () => {
        ApiService.post(
            '/auth/users/reset_password/',
            {
                email: profile.email
            }
        )
        .then((res) => {
            dispatch(updateToast({
                bodyMessage : 'Reset email sent to the registered user.',
                isVisible : true,
                type: 'success'
            }))
        })
        .catch((err) => {
            const error = err.response.data
            dispatch(raiseError({
                error: error ?? null,
                status: err.status
            }))
        });
    };

    const toggleDrawer = (isOpen) => {
        setIsDrawerOpen(isOpen)
    }

    const menuContent = (
        <>
            <Body>
                {
                    !profile.isStaff &&
                    <PageLink
                        onClick={() => toggleDrawer(false)}
                        isSelected={getActiveRoute('/dashboard')}
                        to='/dashboard'
                        variant="text"
                        component={Link}>
                        <CustomDonutLargeOutlinedIcon isSelected={getActiveRoute('/dashboard')}/>
                        <PageLabel
                            isSelected={getActiveRoute('/dashboard')}>
                            Dashboard
                        </PageLabel>
                    </PageLink>
                }
                {
                    profile.isStaff &&
                    <PageLink
                        onClick={() => toggleDrawer(false)}
                        isSelected={getActiveRoute('/calendar')}
                        to='/calendar'
                        variant="text"
                        component={Link}>
                        <CustomCalendarMonthIcon isSelected={getActiveRoute('/calendar')}/>
                        <PageLabel
                            isSelected={getActiveRoute('/calendar')}>
                            Calendar
                        </PageLabel>
                    </PageLink>
                }
                <PageLink
                    onClick={() => toggleDrawer(false)}
                    isSelected={getActiveRoute('/appointment-list')}
                    to='/appointment-list'
                    variant="text"
                    component={Link}>
                    <CustomListOutlinedIcon isSelected={getActiveRoute('/appointment-list')}/>
                    <PageLabel
                        isSelected={getActiveRoute('/appointment-list')}>
                        Appointments
                    </PageLabel>
                </PageLink>
                {
                    profile.isStaff &&
                    <PageLink
                        onClick={() => toggleDrawer(false)}
                        isSelected={getActiveRoute('/user-management-list')}
                        to='/user-management-list'
                        variant="text"
                        component={Link}>
                        <CustomManageAccountsIcon isSelected={getActiveRoute('/user-management-list')}/>
                        <PageLabel
                            isSelected={getActiveRoute('/user-management-list')}>
                            User mangement
                        </PageLabel>
                    </PageLink>
                }
            </Body>
            <Footer>
                <MUILink
                    variant="button"
                    underline={'none'}
                    component="button"
                    onClick={resetPassword}>
                Reset password
                </MUILink>
                <Button
                    variant="outlined"
                    onClick={handleLogout}>
                    LOGOUT
                </Button>
                <Version>
                    Version {process.env.REACT_APP_VERSION}
                </Version>
            </Footer>
        </>
    );

    const user = (
        profile.email &&
        <Row>
        {
            <Avatar
                avatar={profile.avatar}
                alt={profile.firstName[0]}
                size={avatarSize.s}/>
        }
        <Profile>{`Hi, ${profile.firstName} ${profile.lastName}`}</Profile>
        </Row>
    );

    return <Container isLoggedin={profile.email} isMobile={isMobile}>
        {
            !profile.email ?
            <>
                <Left>
                    <PageLink
                        to='/'
                        variant="text"
                        component={Link}>
                        <Logo/>
                        <Title>{process.env.REACT_APP_SITE_NAME}</Title>
                    </PageLink>
                </Left>
                <Right>
                    <Login/>
                    <Signup/>
                </Right>
            </>:
            isMobile ? 
            <>
                <Left>
                    <PageLink
                        to='/'
                        variant="text"
                        component={Link}>
                        <Logo/>
                        <Title>{process.env.REACT_APP_SITE_NAME}</Title>
                    </PageLink>
                </Left>
                <Right>
                    <IconButton onClick={() => toggleDrawer(true)}>
                        <MenuOutlinedIcon/>
                    </IconButton>
                </Right>
                <Drawer
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: {
                                xs: '70vw',
                                sm: '50vw',
                            }
                        },
                    }}
                    open={isDrawerOpen} 
                    onClose={() => toggleDrawer(false)}>
                    {user}
                    {menuContent}
                </Drawer>
            </> :
            <>

                <Header>
                    <HeaderLink
                        to='/'
                        variant="text"
                        component={Link}>
                        <Logo/>
                        <Title>{process.env.REACT_APP_SITE_NAME}</Title>
                    </HeaderLink>
                    {user}
                </Header>
                {menuContent}
            </>
        }
    </Container>
}