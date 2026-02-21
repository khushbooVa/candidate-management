import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axiosInstance";

export const fetchCandidates = createAsyncThunk(
    "candidates/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await API.get("/candidates");
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const createCandidate = createAsyncThunk(
    "candidates/create",
    async (formData, { rejectWithValue }) => {
        try {
            const { data } = await API.post("/candidates", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateStage = createAsyncThunk(
    "candidates/updateStage",
    async ({ id, stage, status, feedbackText, assignedInterviewer, scheduledTime, interviewMode, interviewStatus }, { rejectWithValue }) => {
        try {
            const { data } = await API.patch(`/candidates/${id}/stage`, {
                stage,
                status,
                feedbackText,
                assignedInterviewer,
                scheduledTime,
                interviewMode,
                interviewStatus
            });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateCandidate = createAsyncThunk(
    "candidates/updateProfile",
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const { data } = await API.put(`/candidates/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const nlpSearch = createAsyncThunk(
    "candidates/nlpSearch",
    async (query, { rejectWithValue }) => {
        try {
            const { data } = await API.get(`/search?q=${query}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
