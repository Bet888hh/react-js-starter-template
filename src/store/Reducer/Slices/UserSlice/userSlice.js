import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    Id: "NOLOG",
    Username: "NOLOG",
    Email: "NOLOG",
    Ruolo: "NOLOG",
    Permesso: "NOLOG",
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            console.log("setuser");
            return {
                ...action.payload
            }
        }
    }
})

export default { [userSlice.name]: userSlice.reducer };

export const { setUser } = userSlice.actions;


export const SelectUserSlice = (state) => state.user;

