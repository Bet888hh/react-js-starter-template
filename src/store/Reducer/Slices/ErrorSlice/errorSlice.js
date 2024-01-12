import { createSlice } from "@reduxjs/toolkit";

const errorSlice = createSlice({
    name: 'error',
    initialState: {
        error: null
    },
    reducers: {
        setError: (state, action) => {
            return {
                error: action.payload,
            }
        },
        clearError: (state, action) => {
            return {
                error: null,
            }
        },
    }
})

export default { [errorSlice.name]: errorSlice.reducer };
export const { setError, clearError } = errorSlice.actions;
export const SelectErrorSlice = (state) => state.error;