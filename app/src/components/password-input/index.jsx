import { TextField } from "@mui/material";
import { useState } from "react";
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function PasswordInput(props){
    const {
        error,
        value,
        onChange,
        label,
    } = props;

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return <TextField
    sx={{width: '96%'}}
    type={showPassword ? 'text' : 'password'}
    error = {error}
    value = {value}
    onChange={onChange}
    label={label} 
    helperText = {error}
    variant="outlined"
    slotProps={{
        input: {
            endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
        }
    }}/>
}