import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { BrowserRouter as Router } from 'react-router';

const changeFavicon = () => {
  const favicon = document.getElementById('icon');
  if (favicon) {
    favicon.href = import.meta.env.VITE_TAB_PICTURE;
  }
};
changeFavicon();

document.title = import.meta.env.VITE_SITE_NAME

const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient();
root.render(
  <React.StrictMode>
    <Router>
      <QueryClientProvider client={queryClient}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <App />
            </ThemeProvider>
          </Provider>
        </LocalizationProvider>
      </QueryClientProvider>
    </Router>
  </React.StrictMode>
);
reportWebVitals();
