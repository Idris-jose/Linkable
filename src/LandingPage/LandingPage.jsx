

export default function LandingPage(){
    return(
        <div className="bg-gradient-to-r from-gray-200 to-white min-h-screen flex flex-col justify-center items-center">
            <div>

            </div>

            <div>
                <h1 className="text-6xl font-bold text-center">One link to <span className="bg-gradient-to-r from-blue-700 to-purple-500 via-blue-700 text-transparent bg-clip-text">connect</span><br/>everything</h1>
                <p className="text-center mt-4 text-gray-800">Create a personalized link to share all your content in one place.</p>
                <div className="mt-6 flex justify-center gap-4">
                    <button className="bg-gradient-to-r from-blue-700 to-purple-500 via-blue-700 text-white px-5 py-1 rounded hover:bg-blue-600 transition duration-200">create your link</button>
                    <button className="border-1 border-gray-600 text-black px-5 py-1 rounded hover:bg-blue-600 transition duration-200">View example</button>
                </div>
            </div>
        </div>
    )
}