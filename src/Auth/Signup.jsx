import { Mail, ArrowLeft, Eye, EyeOff, User, Lock, UserPlus, Check } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { signInWithGoogle, signUpWithEmail } = useAuth();

    const handleSigninClick = () => {
         navigate('/Login');
    };

    const handleBackClick = () => {
        // Navigate back
       navigate(-1);
    };

    const handleGoogleSignUp = async () => {
        setLoading(true);
        setError('');
        try {
            await signInWithGoogle();
            navigate('/Mylinks');
        } catch (error) {
            setError('Failed to sign up with Google. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEmailSignUp = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await signUpWithEmail(email, password);
            navigate('/Mylinks');
        } catch (error) {
            setError('Failed to create account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <>
            <div className="bg-gradient-to-br from-gray-200 via-white to-white min-h-screen">
                <button
                    className="flex items-center gap-3 px-4 py-3 ml-6 pt-6 rounded-lg hover:bg-white/60 transition-all duration-200"
                    onClick={handleBackClick}
                >
                    <ArrowLeft className="w-4 h-4" /> 
                    <span className="font-medium">Back</span>
                </button>
                
                <div className="flex flex-col justify-center items-center min-h-[80vh] px-4">
                    <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl shadow-black/20 w-full max-w-md border border-white/20">
                        <div className="p-10 space-y-6">
                            <div className="text-center space-y-2">
                               
                                <h2 className="text-3xl font-bold bg-blue-700 bg-clip-text text-transparent">
                                    Join Linkable
                                </h2>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Create your account to start managing your links and profile.
                                </p>
                            </div>

                           <button
                            type="button"
                            onClick={handleGoogleSignUp}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 border px-6 py-2 w-full rounded border-gray-300 hover:bg-gray-100 transition disabled:opacity-50"
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

                            <div className="space-y-5">
                                <div>
                                    <label
                                        className="block text-gray-700 mb-2 font-medium text-sm"
                                        htmlFor="fullName"
                                    >
                                        <User className="w-4 h-4 inline mr-2" />
                                        Full Name
                                    </label>
                                    <input
                                        className="border-2 border-gray-200 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50"
                                        type="text"
                                        id="fullName"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                        autoComplete="name"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div>
                                    <label
                                        className="block text-gray-700 mb-2 font-medium text-sm"
                                        htmlFor="email"
                                    >
                                        <Mail className="w-4 h-4 inline mr-2" />
                                        Email address
                                    </label>
                                    <input
                                        className="border-2 border-gray-200 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50"
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoComplete="email"
                                        placeholder="Enter your email address"
                                    />
                                </div>

                                <div>
                                    <label
                                        className="block text-gray-700 mb-2 font-medium text-sm"
                                        htmlFor="password"
                                    >
                                        <Lock className="w-4 h-4 inline mr-2" />
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            className="border-2 border-gray-200 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 pr-12"
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            autoComplete="new-password"
                                            placeholder="Create a strong password"
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label
                                        className="block text-gray-700 mb-2 font-medium text-sm"
                                        htmlFor="confirmPassword"
                                    >
                                        <Lock className="w-4 h-4 inline mr-2" />
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            className="border-2 border-gray-200 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 pr-12"
                                            type={showConfirmPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            autoComplete="new-password"
                                            placeholder="Confirm your password"
                                        />
                                        <button
                                            type="button"
                                            onClick={toggleConfirmPasswordVisibility}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                               
                               
                            </div>

                            {error && <p className="text-red-500 text-sm">{error}</p>}

                            <button
                                onClick={handleEmailSignUp}
                                disabled={loading}
                                className="w-full py-3 px-4 rounded flex items-center justify-center gap-2 font-medium transition-all duration-200 transform hover:-translate-y-0.5 bg-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50"
                                type="submit"
                            >
                                <UserPlus className="w-5 h-5" />
                                {loading ? 'Creating account...' : 'Create your account'}
                            </button>

                           <p className="text-blue-800 text-center mt-5 text-sm">
                            Already have an account?{' '}
                            <span
                                className="text-purple-700 hover:underline cursor-pointer"
                                onClick={handleSigninClick}
                            >
                                Sign in
                            </span>
                        </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}