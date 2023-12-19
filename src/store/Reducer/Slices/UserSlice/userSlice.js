import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    Id: "NOLOG",
    Username: "NOLOG",
    Email: "NOLOG",
    Ruolo: "NOLOG",
    Permesso: "NOLOG",
}
const loggedUser = sessionStorage.getItem("loggedUser")

const state = loggedUser? loggedUser:initialState;
const userSlice = createSlice({
    name: 'user',
    state,
    reducers: {
        setUser: (state, action) => {
           sessionStorage.setItem("loggedUser",initialState)
            return {
                ...action.payload
            }
        }
    }
})

export default { [userSlice.name]: userSlice.reducer };

export const { setUser } = userSlice.actions;


export const SelectUserSlice = (state) => state.user;

