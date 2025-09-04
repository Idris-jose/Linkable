import { Mail, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';




export default function Login(){
    const navigate =useNavigate()
    const handleSignupClick = () => {
        navigate('/signup');
    };

    return (
        <div className="bg-gradient-to-r from-gray-200 via-white to-white min-h-screen">
            <button
                className="flex items-center gap-3 px-4 py-2 ml-6 rounded hover:bg-gray-100 transition"
                onClick={() => navigate(-1)}
            >
                <ArrowLeft /> Back
            </button>
            <div className="flex flex-col justify-center items-center min-h-[80vh]">
                <div className="bg-white shadow-2xl rounded-2xl shadow-black/40 w-full max-w-md">
                    <form className="p-10 space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold">Welcome back</h2>
                            <p className="mb-4 text-gray-600 text-sm">
                                Sign in to manage your links and profile
                            </p>
                        </div>

                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 border px-6 py-2 w-full rounded border-gray-300 hover:bg-gray-100 transition"
                        >
                            <img
                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                alt="Google"
                                className="w-5 h-5"
                            />
                            <span className="font-medium">Continue with Google</span>
                        </button>
                            
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500 font-medium">or</span>
                                </div>
                            </div>


                        <div>
                            <label
                                className="block text-gray-700 mb-2 font-medium text-sm"
                                htmlFor="email"
                            >
                                Email
                            </label>
                            <input
                                className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type="email"
                                id="email"
                                required
                                autoComplete="email"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div>
                            <label
                                className="block text-gray-700 mb-2 font-medium text-sm"
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <input
                                className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type="password"
                                id="password"
                                required
                                autoComplete="current-password"
                                placeholder="Enter your password"
                            />
                        </div>
                        <button
                            className="bg-gradient-to-r from-blue-700 to-purple-500 text-white py-2 w-full px-4 rounded flex items-center justify-center gap-2 font-semibold hover:opacity-90 transition"
                            type="submit"
                        >
                            <Mail className="w-4 h-4" />
                            Sign in
                        </button>

                        <p className="text-blue-800 text-center mt-5 text-sm">
                            Don't have an account?{' '}
                            <span
                                className="text-purple-700 hover:underline cursor-pointer"
                                onClick={handleSignupClick}
                            >
                                Sign up
                            </span>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}