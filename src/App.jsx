import { BrowserRouter as Router } from "react-router-dom";
import './App.css'
import LoginRegistrazione from './Pages/LoginRegistrazione/LoginRegistrazione'
import BaseLayer from './BaseLayer'
import { useDispatch,useSelector } from "react-redux";
import { SelectUserSlice } from "./store/Reducer/Slices/UserSlice/UserSlice";
function App() {
 const user = useSelector(SelectUserSlice)
   
   
  return (
    <>
      <Router>
        <BaseLayer />
      </Router>
    </>
  )
}

export default App
