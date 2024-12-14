import './App.css';
import ErrorBoundary from './components/error-boundry';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router';
import Home from './containers/home';
import { Body, Header } from './App.style';
import NavBar from './containers/nav-bar';
import { updateToast } from "./store/toastSlice";
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Snackbar } from '@mui/material';

function App() {
  const toast = useSelector(state => state.toast);
  const dispatch = useDispatch();

  const handleToastClose = () => {
    dispatch(updateToast({
      bodyMessage : '',
      isVisible : false,
      type: toast.type
    }))
  };

  return <ErrorBoundary>
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
    <Router>
      <Header>
      <NavBar/>
      </Header>
      <Body>
        <Routes>
          <Route
            element={<Home/>}
            exact path='/'/>
        </Routes>
      </Body>
    </Router>
  </ErrorBoundary>;
}

export default App;