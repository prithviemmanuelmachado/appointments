import './App.css';
import ErrorBoundary from './components/error-boundry';
import { Routes, Route, useNavigate } from 'react-router';
import Home from './containers/home';
import { Body, Container, Header, ModalCard } from './App.style';
import NavBar from './containers/nav-bar';
import { updateToast } from "./store/toastSlice";
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, GlobalStyles, Modal, Snackbar } from '@mui/material';
import AppointmentList from './containers/appointments-list';
import UserManagementList from './containers/user-management-list';
import ProtectedRoute from './components/protected-route';
import { chipVariant } from './constants';
import { DrawerProvider } from './providers/details-drawer';
import ResetPassword from './containers/reset-password';
import Dashboard from './containers/dashboard';
import Calendar from './containers/calendar';
import { useState } from 'react';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

function App() {
  const toast = useSelector(state => state.toast);
  const profile = useSelector(state => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [disclaimerIsVisibal, setDisclaimerIsVisibal] = useState(true);

  const handleToastClose = () => {
    dispatch(updateToast({
      bodyMessage : '',
      isVisible : false,
      type: toast.type
    }))
  };

  const handleDisclaimerClose = () => {
    setDisclaimerIsVisibal(false)
  }

  return <ErrorBoundary navigate={navigate}>
    <Modal
      open={disclaimerIsVisibal}
      onClose={handleDisclaimerClose}
      aria-labelledby="disclaimer-modal-title"
      aria-describedby="disclaimer-modal-description"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      >
      <ModalCard>
      <WarningAmberOutlinedIcon
        color='error'
        sx={{fontSize: '100px'}}/>
      <p>
      <span style={{fontWeight: 'bold'}}>Disclaimer:</span> This application is developed solely for portfolio purposes and is not intended for commercial use. 
      All features and functionalities are for demonstration only and may not represent a fully operational product.
      For any queries contact me at <span style={{fontWeight: 'bold'}}>prithviemmanuelmachado@gmail.com</span>
      </p>
      <Button variant={'contained'} onClick={handleDisclaimerClose}>Got it</Button>
      </ModalCard>
    </Modal>
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