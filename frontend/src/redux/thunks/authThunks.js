import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axiosInstance";

export const login = createAsyncThunk(
    "auth/login",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const { data } = await API.post("/auth/login", { email, password });
            localStorage.setItem("userInfo", JSON.stringify(data));
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

export const fetchInterviewers = createAsyncThunk(
    "auth/fetchInterviewers",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await API.get("/auth/interviewers");
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
