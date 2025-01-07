import { Body, Container, CustomListOutlinedIcon, CustomManageAccountsIcon, Footer, Header, HeaderLink, Left, PageLabel, PageLink, Profile, ProfileAvatar, Right, Row, Title, Version } from "./index.style";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { clearProfile } from "../../store/profileSlice";
import { Link, useLocation } from 'react-router';
import Login from "../login";
import Signup from "../signup";
import { avatarSize } from "../../constants";
import Avatar from "../../components/avatar";

export default function NavBar(props){
    const {
        navigate
    } = props;
    const profile = useSelector(state => state.profile);
    const location = useLocation();

    const dispatch = useDispatch();

    const handleLogout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('email');
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
        localStorage.removeItem('isStaff');
        dispatch(clearProfile());
        navigate('/', { replace: true });
    }

    const getActiveRoute = (path) => {
        return location.pathname.includes(path);
    }

    return <Container isLoggedin={profile.email}>
        {
            !profile.email ?
            <>
                <Left>
                    <PageLink
                        to='/'
                        variant="text"
                        component={Link}>
                        <Title>{process.env.REACT_APP_SITE_NAME}</Title>
                    </PageLink>
                </Left>
                <Right>
                    <Login/>
                    <Signup/>
                </Right>
            </>:
            <>
                <Header>
                    <HeaderLink
                        to='/'
                        variant="text"
                        component={Link}>
                        <Title>{process.env.REACT_APP_SITE_NAME}</Title>
                    </HeaderLink>
                    <Row>
                    {
                        <Avatar
                            avatar={profile.avatar}
                            alt={profile.firstName[0]}
                            size={avatarSize.s}/>
                    }
                    <Profile>{`Hi, ${profile.firstName} ${profile.lastName}`}</Profile>
                    </Row>
                </Header>
                <Body>
                    <PageLink
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
        }
    </Container>
}