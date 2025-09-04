import LandingPage from "./LandingPage/LandingPage"
import { BrowserRouter,Routes,Route } from "react-router-dom"
import Signup from "./Auth/Signup"
import Login from "./Auth/Login"

function App() {
 

  return (
    <>
     
    <BrowserRouter>
    <Routes>
     <Route path="/" element={<LandingPage/>}/>
     <Route path="/Login" element={<Login/>}/>
     <Route path="/Signup" element={<Signup/>}/>
    </Routes>
    </BrowserRouter>

    </>
  )
}

export default App
