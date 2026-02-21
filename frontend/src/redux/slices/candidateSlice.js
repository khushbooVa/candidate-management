import { createSlice } from "@reduxjs/toolkit";
import { fetchCandidates, createCandidate, updateStage, nlpSearch } from "../thunks/candidateThunks";

const candidateSlice = createSlice({
    name: "candidates",
    initialState: {
        list: [],
        loading: false,
        error: null,
        stats: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch All
            .addCase(fetchCandidates.pending, (state) => { state.loading = true; })
            .addCase(fetchCandidates.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchCandidates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Search
            .addCase(nlpSearch.fulfilled, (state, action) => {
                state.list = action.payload;
            })
            // Create
            .addCase(createCandidate.fulfilled, (state, action) => {
                state.list.unshift(action.payload);
            })
            // Update Stage
            .addCase(updateStage.fulfilled, (state, action) => {
                const index = state.list.findIndex(c => c._id === action.payload._id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            });
    },
});

export default candidateSlice.reducer;
