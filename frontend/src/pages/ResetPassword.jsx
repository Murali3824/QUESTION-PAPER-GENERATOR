import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Sparkles, Mail, Eye, EyeOff, Loader2, KeyRound, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { backendUrl, userData } = useContext(AppContext);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, { email });

            if (data.success) {
                toast.success('OTP sent to your email.');
                setOtpSent(true);
            } else {
                toast.error(data.message || 'Failed to send OTP.');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/reset-password`, { email, otp, newPassword });

            if (data.success) {
                toast.success('Password reset successful.');
                navigate('/login');
            } else {
                toast.error(data.message || 'Invalid OTP or error resetting password.');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleGoBack = () => {
        if (otpSent) {
            setOtpSent(false);
        } else {
            navigate('/login');
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
                    <button 
                        onClick={handleGoBack}
                        className="flex items-center gap-1 text-slate-400 hover:text-violet-400 transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                    </button>

                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                            <KeyRound className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">
                            Reset Password
                        </h2>
                    </div>
                    
                    <p className="text-slate-400 mb-6">
                        {otpSent
                            ? 'Enter the OTP sent to your email and create a new password.'
                            : 'Enter your registered email address to receive a verification code.'}
                    </p>

                    {!otpSent ? (
                        <form onSubmit={handleSendOtp} className="space-y-4">
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-all">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    type="email"
                                    placeholder="Email Address"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                                    required
                                />
                            </div>
                            
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 mt-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium shadow-md shadow-indigo-500/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-70"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <Loader2 className="animate-spin w-5 h-5 mr-2" />
                                        <span>Sending...</span>
                                    </div>
                                ) : (
                                    'Send Verification Code'
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleOtpSubmit} className="space-y-4">
                            <div className="relative">
                                <input
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    type="text"
                                    placeholder="Enter Verification Code"
                                    className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                                    required
                                />
                            </div>
                            
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-all">
                                    <KeyRound className="w-5 h-5" />
                                </div>
                                <input
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="New Password"
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
                            
                            <div className="mt-2 text-xs text-slate-400">
                                <p>Your password should:</p>
                                <ul className="list-disc pl-4 mt-1 space-y-1">
                                    <li>Be at least 8 characters long</li>
                                    <li>Include uppercase and lowercase letters</li>
                                    <li>Include at least one number</li>
                                </ul>
                            </div>
                            
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 mt-4 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium shadow-md shadow-indigo-500/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-70"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <Loader2 className="animate-spin w-5 h-5 mr-2" />
                                        <span>Resetting...</span>
                                    </div>
                                ) : (
                                    'Reset Password'
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;