import userSlice from "./UserSlice/UserSlice"
import ErrorSlice from "./ErrorSlice/errorSlice"
import notifSlice from "./notifSlice/notifSlice"
export default {
    ...userSlice ,
    ...ErrorSlice,
    ...notifSlice,
    
}