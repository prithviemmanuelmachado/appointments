import { configureStore } from "@reduxjs/toolkit";
import toastSlice from "./toastSlice";
import profileSlice from "./profileSlice";

export const store = configureStore({
    reducer:{
        toast: toastSlice,
        profile: profileSlice
    }
});