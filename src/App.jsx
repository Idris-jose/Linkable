import LandingPage from "./LandingPage/LandingPage"
import { BrowserRouter,Routes,Route } from "react-router-dom"
import Signup from "./Auth/Signup"
import Login from "./Auth/Login"
import Sidebar from "./Navigation/sidebar"
import Customize from "./pages/Customize"
import QrCode from "./pages/Qrcode"
import Mylinks from "./pages/Mylinks"

function LayoutWithSidebar({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-0 md:ml-64 ">
        {children}
      </div>
    </div>
  )
}

function App() {
  return (
    <>
     
    <BrowserRouter>
    <Routes>
     <Route path="/" element={<LandingPage/>}/>
     <Route path="/Login" element={<Login/>}/>
     <Route path="/Signup" element={<Signup/>}/>
     <Route path="/Mylinks" element={<LayoutWithSidebar><Mylinks/></LayoutWithSidebar>}/>
     <Route path="/Customize" element={<LayoutWithSidebar><Customize/></LayoutWithSidebar>}/>
     <Route path="/Qrcode" element={<LayoutWithSidebar><QrCode/></LayoutWithSidebar>}/>
    </Routes>
    </BrowserRouter>

    </>
  )
}

export default App
