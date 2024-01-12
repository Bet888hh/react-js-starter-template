import userSlice from "./UserSlice/UserSlice"
import ErrorSlice from "./ErrorSlice/ErrorSlice"

export default {
    ...userSlice ,
    ...ErrorSlice
}