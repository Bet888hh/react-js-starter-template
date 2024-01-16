import userSlice from "./UserSlice/UserSlice"
import ErrorSlice from "./ErrorSlice/ErrorSlice"
import notifSlice from "./notifSlice/notifSlice"
export default {
    ...userSlice ,
    ...ErrorSlice,
    ...notifSlice,
    
}