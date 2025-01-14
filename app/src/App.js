import './App.css';
import ErrorBoundary from './components/error-boundry';
import { Routes, Route, useNavigate } from 'react-router';
import Home from './containers/home';
import { Body, Container, Header } from './App.style';
import NavBar from './containers/nav-bar';
import { updateToast } from "./store/toastSlice";
import { useDispatch, useSelector } from 'react-redux';
import { Alert, GlobalStyles, Snackbar } from '@mui/material';
import AppointmentList from './containers/appointments-list';
import UserManagementList from './containers/user-management-list';
import ProtectedRoute from './components/protected-route';
import { chipVariant } from './constants';
import { DrawerProvider } from './providers/details-drawer';
import ResetPassword from './containers/reset-password';
import Dashboard from './containers/dashboard';
import Calendar from './containers/calendar';

function App() {
  const toast = useSelector(state => state.toast);
  const profile = useSelector(state => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleToastClose = () => {
    dispatch(updateToast({
      bodyMessage : '',
      isVisible : false,
      type: toast.type
    }))
  };

  return <ErrorBoundary navigate={navigate}>
    <GlobalStyles
        styles={{
          '*::-webkit-scrollbar': {
            width: '0.5em',
            height: '0.5rem',
          },
          '*::-webkit-scrollbar-track': {
            '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: chipVariant.primary,
            outline: chipVariant.primary
          }
        }}/>
    <Snackbar
      autoHideDuration={6000}
      anchorOrigin={{
      vertical: 'top',
      horizontal: 'right'
      }}
      open={toast.isVisible}
      onClose={handleToastClose}
      key={'top right'}>
      <Alert
      variant='filled'
      onClose={handleToastClose} 
      severity={toast.type} 
      sx={{ 
          width: '100%',
      }}>
      {toast.bodyMessage}
      </Alert>
    </Snackbar>
    <Container isLoggedin={profile.email}>
      <DrawerProvider>
      <Header isLoggedin={profile.email}>
        <NavBar/>
      </Header>
      <Body isLoggedin={profile.email}>
        <Routes>
          <Route
            element={<Home/>}
            path='/'/>
          <Route
            element={
              <ResetPassword/>
            }
            exact path='/reset-password/:uid/:token'/>
          <Route element = {<ProtectedRoute/>}>
            <Route
              element={
                <AppointmentList/>
              }
              exact path='/appointment-list'/>
          </Route>
          <Route element = {<ProtectedRoute/>}>
            <Route
              element={
                <AppointmentList/>
              }
              exact path='/appointment-list/:id'/>
          </Route>
          <Route element = {<ProtectedRoute isAdminOnly={true}/>}>
            <Route
              element={
                <UserManagementList/>
              }
              exact path='/user-management-list'/>
          </Route>
          <Route element = {<ProtectedRoute isAdminOnly={true}/>}>
            <Route
              element={
                <UserManagementList/>
              }
              exact path='/user-management-list/:id'/>
          </Route>
          <Route element = {<ProtectedRoute isAdminOnly={true}/>}>
            <Route
              element={
                <Calendar/>
              }
              exact path='/calendar'/>
          </Route>
          <Route element = {<ProtectedRoute isAdminOnly={true}/>}>
            <Route
              element={
                <Calendar/>
              }
              exact path='/calendar/:id'/>
          </Route>
          <Route element = {<ProtectedRoute isNotAdminOnly={true}/>}>
            <Route
              element={
                <Dashboard/>
              }
              exact path='/dashboard'/>
          </Route>
          <Route element = {<ProtectedRoute isNotAdminOnly={true}/>}>
            <Route
              element={
                <Dashboard/>
              }
              exact path='/dashboard/:id'/>
          </Route>
        </Routes>
      </Body>
      </DrawerProvider>
    </Container>
  </ErrorBoundary>;
}

export default App;