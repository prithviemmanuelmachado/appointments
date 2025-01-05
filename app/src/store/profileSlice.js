import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    email: localStorage.getItem('email') ?? null,
    firstName: localStorage.getItem('firstName') ?? null,
    lastName: localStorage.getItem('lastName') ?? null,
    isStaff: localStorage.getItem('isStaff') === 'true' ?? null,
    avatar: localStorage.getItem('avatar') ?? null
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
            state.avatar = action.payload.avatar;
        },
        clearProfile: (state, action) => {
            state.email = null;
            state.firstName = null;
            state.lastName = null;
            state.isStaff = false;
            state.avatar = null;
        }
    }
})

export const { updateProfile, clearProfile } = profileSlice.actions;

export default profileSlice.reducer;