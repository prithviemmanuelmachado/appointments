import { createTheme } from '@mui/material/styles';
import { indigo, blueGrey } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: indigo[500], 
      contrastText: blueGrey[50],
      light: indigo[50],
      dark: indigo[900]
    },
  },
});

export default theme;