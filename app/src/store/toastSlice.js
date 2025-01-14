import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    bodyMessage: '',
    isVisible: false,
    type: 'error'
}

export const toastSlice = createSlice({
    name: 'toastSlice',
    initialState,
    reducers: {
        updateToast: (state, action) => {
            if (typeof action.payload.bodyMessage === 'string') {
                state.bodyMessage = action.payload.bodyMessage;
            } else if (typeof action.payload.bodyMessage === 'object' && action.payload.bodyMessage !== null) {
                const firstKey = Object.keys(action.payload.bodyMessage)[0];
                if (Array.isArray(action.payload.bodyMessage[firstKey])) {
                    state.bodyMessage = action.payload.bodyMessage[firstKey][0];
                }
            }
            state.isVisible = action.payload.isVisible;
            state.type = action.payload.type;
        },
        raiseError: (state, action) => {
            const errorObj = action.payload.error;
            let message = 'An error occurred';
            if(errorObj instanceof Object){
                message = '';
                Object.keys(errorObj).map((key) => {
                    message += `${key.replaceAll('_', ' ').toUpperCase()}: ${
                        errorObj[key] instanceof Array ?
                        errorObj[key].join(', ') :
                        errorObj[key]
                    }`;
                })
            }
            state.bodyMessage = message;
            state.isVisible = true;
            state.type = 'error';
        }
    }
})

export const { updateToast, raiseError } = toastSlice.actions;

export default toastSlice.reducer;