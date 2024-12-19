import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShieldCheck, User, Mail, Lock, Check, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [state, setState] = useState('Login');
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const [isLoading, setIsLoading] = useState(false);  // Loading state

    const onsubmitHandler = async (e) => {
        e.preventDefault();

        setIsLoading(true);  // Set loading state to true
        
        try {
            axios.defaults.withCredentials = true;

            if (state === 'Sign Up') {
                const { data } = await axios.post(backendUrl + '/api/auth/register', { name, email, password });
                setIsLoading(false);  // Reset loading state
                if (data.message.includes("Registration successful, please verify your email.")) {
                    toast.success("Registration successful, please verify your email.");
                    navigate('/verify');
                } else {
                    if (data.message.includes("User already exists but email is not verified. Please verify your email.")) {
                        toast.success("Please verify your email first.");
                        navigate('/verify');
                    } else {
                        toast.error(data.message);
                    }
                }
            } else {
                const { data } = await axios.post(backendUrl + '/api/auth/login', { email, password });
                setIsLoading(false);  // Reset loading state
                // console.log(data);
                if (data.success) {
                    toast.success("Login successful");
                    setIsLoggedin(true);
                    getUserData();
                    setTimeout(() => {
                        setIsLoading(true)
                        navigate('/');
                    }, 500);
                } else {
                    // Check for the specific message indicating email verification
                    if (data.message.includes("Email not verified")) {
                        toast.info("Please verify your email first.");
                        navigate('/verify');  
                    } else {
                        toast.error(data.message || "Something went wrong");
                    }
                }
            }
        } catch (error) {
            setIsLoading(false); 
            console.error(error);  
            toast.error(error.response?.data?.message || "An error occurred during login.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center p-4">
            <div onClick={() => navigate('/')} className="cursor-pointer absolute left-4 md:left-14 lg:left-24 top-6 flex items-center gap-3">
                <div className="bg-indigo-500/20 p-2 rounded-full animate-pulse">
                    <ShieldCheck className="text-indigo-400 w-10 h-10" />
                </div>
                <span className="text-white text-3xl font-semibold tracking-wider">
                    AUTHFLOW
                </span>
            </div>

            <div className="w-full max-w-md bg-slate-800 rounded-3xl shadow-2xl overflow-hidden ">
                <div className="p-8">
                    <h2 className="text-4xl font-bold text-white text-center mb-4 flex items-center justify-center gap-3">
                        {state === 'Sign Up' ? (
                            <>
                                <UserPlus className="w-10 h-10 text-indigo-400" />
                                Create Account
                            </>
                        ) : (
                            <>
                                <LogIn className="w-10 h-10 text-indigo-400" />
                                Welcome Back
                            </>
                        )}
                    </h2>
                    <p className="text-slate-400 text-center mb-8">
                        {state === 'Sign Up' 
                            ? 'Join our platform and start your journey!' 
                            : 'Sign in to continue your session'}
                    </p>

                    <form onSubmit={onsubmitHandler} className="space-y-6">
                        {state === 'Sign Up' && (
                            <div className="relative group">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    onChange={e => setName(e.target.value)}
                                    value={name}
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                                    required
                                />
                            </div>
                        )}

                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                onChange={e => setEmail(e.target.value)}
                                value={email}
                                type="email"
                                placeholder="Email Address"
                                className="w-full pl-10 pr-4 py-3 bg-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                onChange={e => setPassword(e.target.value)}
                                value={password}
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="w-full pl-10 pr-4 py-3 bg-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-indigo-400 transition-colors"
                            >
                                {showPassword ? 
                                    <EyeOff className="w-5 h-5" /> : 
                                    <Eye className="w-5 h-5" />
                                }
                            </button>
                        </div>

                        {state === 'Login' && (
                            <div className="flex items-center justify-between">
                                <label
                                    className="flex items-center text-slate-400 text-sm cursor-pointer"
                                    onClick={() => setRememberMe(!rememberMe)}
                                >
                                    <div className={`mr-2 w-5 h-5 border rounded flex items-center justify-center transition-colors
                                        ${rememberMe ? 'bg-indigo-500 border-indigo-500' : 'border-slate-600'}`}>
                                        {rememberMe && <Check className="w-4 h-4 text-white" />}
                                    </div>
                                    Remember me
                                </label>
                                <span 
                                    onClick={() => navigate('/reset-password')} 
                                    className="text-sm text-indigo-400 hover:underline cursor-pointer transition-colors"
                                >
                                    Forgot password?
                                </span>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 "
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-4 border-indigo-300 border-t-transparent rounded-full animate-spin mx-auto"></div>  // Spinner animation
                            ) : (
                                state
                            )}
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        {state === 'Sign Up' ? (
                            <p className="text-slate-400 text-sm">
                                Already have an account?{' '}
                                <button
                                    onClick={() => setState('Login')}
                                    className="text-indigo-400 hover:underline font-semibold"
                                >
                                    Login
                                </button>
                            </p>
                        ) : (
                            <p className="text-slate-400 text-sm">
                                Don't have an account?{' '}
                                <button
                                    onClick={() => setState('Sign Up')}
                                    className="text-indigo-400 hover:underline font-semibold"
                                >
                                    Sign Up
                                </button>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
