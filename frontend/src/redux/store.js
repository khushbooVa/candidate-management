import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import candidateReducer from "./slices/candidateSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        candidates: candidateReducer,
    },
});

export default store;
