import './App.css';
import ErrorBoundary from './components/error-boundry';
import { Routes, Route, useNavigate } from 'react-router';
import Home from './containers/home';
import { Body, Header } from './App.style';
import NavBar from './containers/nav-bar';
import { updateToast } from "./store/toastSlice";
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Snackbar } from '@mui/material';
import AppointmentList from './containers/appointments-list';
import UserManagementList from './containers/user-management-list';
import ProtectedRoute from './components/protected-route';
import UserDetails from './containers/user-details';
import AppointmentDetails from './containers/appointment-details';

function App() {
  const toast = useSelector(state => state.toast);
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
    <Header>
      <NavBar navigate={navigate}/>
    </Header>
    <Body>
      <Routes>
        <Route
          element={<Home/>}
          exact path='/'/>
        <Route element = {<ProtectedRoute/>}>
          <Route
            element={
              <AppointmentList navigate={navigate}/>
            }
            exact path='/appointment-list'/>
        </Route>
        <Route element = {<ProtectedRoute isAdminOnly={true}/>}>
          <Route
            element={
              <UserManagementList navigate={navigate}/>
            }
            exact path='/user-management-list'/>
        </Route>
        <Route element = {<ProtectedRoute/>}>
          <Route
            element={
              <AppointmentDetails navigate={navigate}/>
            }
            exact path='/appointment-details/:id'/>
        </Route>
        <Route element = {<ProtectedRoute isAdminOnly={true}/>}>
          <Route
            element={
              <UserDetails navigate={navigate}/>
            }
            exact path='/user-details/:id'/>
        </Route>
      </Routes>
    </Body>
  </ErrorBoundary>;
}

export default App;