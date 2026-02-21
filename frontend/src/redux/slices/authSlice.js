import { createSlice } from "@reduxjs/toolkit";
import { login, fetchInterviewers } from "../thunks/authThunks";

const userInfoFromStorage = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

const authSlice = createSlice({
    name: "auth",
    initialState: {
        userInfo: userInfoFromStorage,
        interviewers: [],
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            localStorage.removeItem("userInfo");
            state.userInfo = null;
            state.interviewers = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Handle fetchInterviewers
        builder
            .addCase(fetchInterviewers.fulfilled, (state, action) => {
                state.interviewers = action.payload;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
