import { useNavigate } from "react-router-dom"

export default function LandingPage(){
    const navigate = useNavigate()

    
    return(
        <div className="bg-gradient-to-r from-gray-200 via-white to-white min-h-screen flex flex-col justify-center items-center">
            <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center" >
             <h1 className="font-semibold text-2xl">Linkable</h1>
               
             <div className="flex gap-3 items-center">
                <button className="border-1 border-gray-600 text-black px-4 py-1 rounded hover:bg-black hover:text-white  transition-colors duration-400" onClick={() => navigate("/Login")}>Sign in</button>
               <button className="bg-gradient-to-r from-blue-700 to-purple-500 via-blue-700 text-white px-4 py-1 rounded hover:bg-blue-600 hover:scale-95 transition-transform duration-200" onClick={() => navigate("/Signup")}>Get started</button>
                    
             </div>
            </div>

            <div>
                <h1 className="text-6xl font-bold text-center">One link to <span className="bg-gradient-to-r from-blue-700 to-purple-500 via-blue-700 text-transparent bg-clip-text">connect</span><br/>everything</h1>
                <p className="text-center mt-4 text-gray-600">Create a personalized and easily shareable link that houses<br/> all your important links in one place.</p>
                <div className="mt-6 flex justify-center gap-4">
                    <button className="bg-gradient-to-r from-blue-700 to-purple-500 via-blue-700 text-white px-5 py-1 rounded hover:bg-blue-600 hover:scale-95 transition-transform duration-200 shadow-md shadow-gray-950/60">create your link</button>
                    <button className="border-1 border-gray-600 text-black px-5 py-1 rounded hover:bg-black hover:text-white  transition-colors duration-400">View example</button>
                </div>
            </div>
        </div>
    )
}