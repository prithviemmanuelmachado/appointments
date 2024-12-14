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
        }
    }
})

export const { updateToast } = toastSlice.actions;

export default toastSlice.reducer;