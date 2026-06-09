import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./authSlice.ts";

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});