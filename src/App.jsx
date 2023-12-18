import {  BrowserRouter as Router } from "react-router-dom";
import './App.css'
import BaseLayer from './BaseLayer'


function App() {
  /*  const user = useSelector(SelectUserSlice)
   console.log("user: ", user);
   const dispatch = useDispatch(); */

  return (
    <>
      <Router>
        <BaseLayer />
      </Router>
    </>
  )
}

export default App
