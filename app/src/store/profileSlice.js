import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    email: "prom8273@gmail.com",
    firstName: "Test",
    lastName: "User",
    isStaff: false
}

export const profileSlice = createSlice({
    name: 'profileSlice',
    initialState,
    reducers: {
        updateProfile: (state, action) => {
            state.email = action.payload.email;
            state.firstName = action.payload.firstName;
            state.lastName = action.payload.lastName;
            state.isStaff = action.payload.isStaff;
        }
    }
})

export const { updateProfile } = profileSlice.actions;

export default profileSlice.reducer;