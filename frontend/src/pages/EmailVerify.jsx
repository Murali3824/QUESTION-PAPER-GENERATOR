import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Mail, Loader2, RefreshCw, ArrowLeft, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';

const EmailVerify = () => {
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { backendUrl, userData, getUserData, setIsLoggedin } = useContext(AppContext);

    // Get email and userId from either location state or userData
    const email = location.state?.email || userData?.email;
    const userId = location.state?.userId || userData?._id;

    useEffect(() => {
        // Redirect if no email/userId is available
        if (!email || !userId) {
            navigate('/email-verify');
            return;
        }

        // Redirect if user is already verified
        if (userData?.isAccountVerified) {
            navigate('/');
        }
    }, [email, userId, userData, navigate]);

    const handleSendOtp = async () => {
        setLoading(true);
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/send-verify-otp`, {
                userId,
                email
            });

            if (data.success) {
                toast.success("OTP sent to your email");
                setOtpSent(true);
            } else {
                toast.error(data.message || "Failed to send OTP");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setResendLoading(true);
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/send-verify-otp`, {
                userId,
                email
            });

            if (data.success) {
                toast.success("New OTP sent to your email");
            } else {
                toast.error(data.message || "Failed to resend OTP");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to resend OTP");
        } finally {
            setResendLoading(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/verify-account`, {
                userId,
                otp
            });

            if (data.success) {
                toast.success("Email verified successfully");
                setIsLoggedin(true);
                getUserData();
                navigate('/');
            } else {
                toast.error(data.message || "Invalid OTP");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        if (otpSent) {
            setOtpSent(false);
        } else {
            navigate('/');
        }
    };

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
                            <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">
                            Verify Your Email
                        </h2>
                    </div>
                    
                    <p className="text-slate-400 mb-6">
                        {otpSent
                            ? `Enter the verification code sent to your email`
                            : 'Verify your email address to complete account setup and access all features.'}
                    </p>

                    {!otpSent ? (
                        <div className="space-y-4">
                            <button
                                onClick={handleSendOtp}
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
                        </div>
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
                            
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 mt-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium shadow-md shadow-indigo-500/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-70"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <Loader2 className="animate-spin w-5 h-5 mr-2" />
                                        <span>Verifying...</span>
                                    </div>
                                ) : (
                                    'Verify Email'
                                )}
                            </button>
                            
                            <div className="text-center mt-4">
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={resendLoading}
                                    className="flex items-center justify-center gap-1 mx-auto text-slate-400 hover:text-violet-400 transition-colors"
                                >
                                    <RefreshCw className={`w-4 h-4 ${resendLoading ? 'animate-spin' : ''}`} />
                                    <span>Resend Verification Code</span>
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmailVerify;