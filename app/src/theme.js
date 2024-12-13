import { createTheme } from '@mui/material/styles';
import { green, grey } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: green[500], 
      contrastText: grey[50],
      light: green[50],
      dark: green[900]
    },
  },
});

export default theme;