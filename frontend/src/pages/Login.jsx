import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Sparkles, User, Mail, Lock, Check, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [state, setState] = useState('Login');
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const { userData, backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const [isLoading, setIsLoading] = useState(false);

    const onsubmitHandler = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        try {
            axios.defaults.withCredentials = true;

            if (state === 'Sign Up') {
                const { data } = await axios.post(backendUrl + '/api/auth/register', { name, email, password });
                setIsLoading(false);
                
                if (data.message.includes("Registration successful, please verify your email.")) {
                    toast.success("Registration successful, please verify your email.");
                    navigate('/email-verify');
                } else {
                    if (data.message.includes("User exists but not verified")) {
                        toast.success("User exists but not verified");
                        navigate('/email-verify');
                    } else {
                        toast.error(data.message);
                    }
                }
            } else {
                const { data } = await axios.post(backendUrl + '/api/auth/login', { email, password });
                setIsLoading(false);
                
                if (data.message.includes("Login successful")) {
                    toast.success("Login successful");
                    setIsLoggedin(true);
                    getUserData();
                    setTimeout(() => {
                        setIsLoading(true);
                        navigate('/');
                    }, 500);
                } else {
                    if (data.message.includes("Email verification required")) {
                        toast.info("Please verify your email first.");
                        navigate('/email-verify');
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

    useEffect(() => {
        if (userData) {
            navigate("/");
        }
    }, [userData, navigate]);

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 pt-20">
            {/* Logo */}
            <div 
                onClick={() => navigate('/')} 
                className="cursor-pointer absolute left-4 md:left-8 top-6 flex items-center gap-2 group"
            >
                <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-1 sm:p-2 rounded-lg group-hover:shadow-lg group-hover:shadow-violet-500/20 transition-all duration-300">
                    <Sparkles className="text-white w-5 h-5" />
                </div>
                <span className="bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent text-2xl sm:text-3xl font-bold tracking-tight">
                    XamGen
                </span>
            </div>

            <div className="w-full max-w-md mt-10 bg-slate-800/50 backdrop-blur-md rounded-xl shadow-xl border border-slate-700 overflow-hidden">
                <div className="p-8">
                    <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        {state === 'Sign Up' ? (
                            <>
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                                    <UserPlus className="w-5 h-5 text-white" />
                                </div>
                                Create Account
                            </>
                        ) : (
                            <>
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                                    <LogIn className="w-5 h-5 text-white" />
                                </div>
                                Welcome Back
                            </>
                        )}
                    </h2>
                    <p className="text-slate-400 mb-8">
                        {state === 'Sign Up'
                            ? 'Join our platform and start your journey!'
                            : 'Sign in to continue your session'}
                    </p>

                    <form onSubmit={onsubmitHandler} className="space-y-4">
                        {state === 'Sign Up' && (
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-all">
                                    <User className="w-5 h-5" />
                                </div>
                                <input
                                    onChange={e => setName(e.target.value)}
                                    value={name}
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                                    required
                                />
                            </div>
                        )}

                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-all">
                                <Mail className="w-5 h-5" />
                            </div>
                            <input
                                onChange={e => setEmail(e.target.value)}
                                value={email}
                                type="email"
                                placeholder="Email Address"
                                className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-all">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                onChange={e => setPassword(e.target.value)}
                                value={password}
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="w-full pl-10 pr-12 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-violet-500 transition-colors"
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
                                    <div className={`mr-2 w-5 h-5 rounded flex items-center justify-center transition-colors
                                        ${rememberMe ? 'bg-gradient-to-br from-violet-600 to-indigo-600 border-violet-500' : 'bg-slate-700 border border-slate-600'}`}>
                                        {rememberMe && <Check className="w-4 h-4 text-white" />}
                                    </div>
                                    Remember me
                                </label>
                                <span
                                    onClick={() => navigate('/reset-password')}
                                    className="text-sm text-violet-400 hover:text-violet-300 cursor-pointer transition-colors"
                                >
                                    Forgot password?
                                </span>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3 mt-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium shadow-md shadow-indigo-500/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-3 border-t-transparent border-white rounded-full animate-spin mx-auto"></div>
                            ) : (
                                state
                            )}
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <div className="relative flex items-center justify-center">
                            <div className="border-t border-slate-700 w-full absolute"></div>
                            <span className="bg-slate-800 px-4 text-xs text-slate-500 relative">OR</span>
                        </div>

                        {state === 'Sign Up' ? (
                            <p className="text-slate-400 text-sm mt-4">
                                Already have an account?{' '}
                                <button
                                    onClick={() => setState('Login')}
                                    className="text-violet-400 hover:text-violet-300 font-medium"
                                >
                                    Login
                                </button>
                            </p>
                        ) : (
                            <p className="text-slate-400 text-sm mt-4">
                                Don't have an account?{' '}
                                <button
                                    onClick={() => setState('Sign Up')}
                                    className="text-violet-400 hover:text-violet-300 font-medium"
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