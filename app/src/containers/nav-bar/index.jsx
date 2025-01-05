import { Container, Left, PageLink, Profile, Right, Title } from "./index.style";
import { Avatar, Button } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { clearProfile } from "../../store/profileSlice";
import { Link, useLocation } from 'react-router';
import Login from "../login";
import Signup from "../signup";

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
        return location.pathname === path;
    }

    return <Container>
        <Left>
            <PageLink
                to='/'
                variant="text"
                component={Link}>
                <Title>{process.env.REACT_APP_SITE_NAME}</Title>
            </PageLink>
        </Left>
        <Right>
            {
                profile.email ?
                <>
                    {
                        profile.avatar ?
                        <Avatar src={profile.avatar} /> :
                        <Avatar>{profile.firstName[0]}</Avatar>
                    }
                    <Profile>{`Hi, ${profile.firstName} ${profile.lastName}`}</Profile>
                    <PageLink
                        isSelected={getActiveRoute('/appointment-list')}
                        to='/appointment-list'
                        variant="text"
                        component={Link}>
                        Appointments
                    </PageLink>
                    {
                        profile.isStaff &&
                        <PageLink
                            isSelected={getActiveRoute('/user-management-list')}
                            to='/user-management-list'
                            variant="text"
                            component={Link}>
                            User mangement
                        </PageLink>
                    }
                    <Button
                        variant="outlined"
                        onClick={handleLogout}>
                        LOGOUT
                    </Button>
                </>:
                <>
                    <Login/>
                    <Signup/>
                </>
            }
        </Right>
    </Container>
}