import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Loader2, RefreshCw } from 'lucide-react';
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

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            {/* Logo */}
            <div onClick={() => navigate('/')} className="cursor-pointer absolute left-4 md:left-14 lg:left-24 top-6 flex items-center gap-3">
                <div className="bg-indigo-500/20 p-2 rounded-full animate-pulse">
                    <ShieldCheck className="text-indigo-400 w-10 h-10" />
                </div>
                <span className="text-white text-3xl font-semibold tracking-wider">
                    AUTHFLOW
                </span>
            </div>

            <div className="w-full max-w-md bg-gradient-to-br from-blue-950 to-emerald-900 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-4 py-10">
                    <h2 className="text-3xl font-bold text-white text-center mb-4">
                        Verify Your Email
                    </h2>
                    <p className="text-zinc-400 text-center mb-8">
                        {otpSent
                            ? `Enter the OTP sent to ${email}`
                            : 'Click the button below to receive an OTP for email verification.'}
                    </p>

                    {!otpSent ? (
                        <button
                            onClick={handleSendOtp}
                            className="group relative w-full py-3 bg-indigo-400 overflow-hidden font-medium transition duration-300 ease-out border border-transparent rounded-lg hover:shadow-2xl hover:border-white"
                            disabled={loading}
                        >
                            <span className="flex items-center font-semibold justify-center w-full h-full text-white">
                                {loading ? (
                                    <Loader2 className="animate-spin w-5 h-5 mr-2" />
                                ) : (
                                    "Send OTP"
                                )}
                            </span>
                        </button>
                    ) : (
                        <form onSubmit={handleOtpSubmit} className="space-y-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full pl-4 pr-4 py-3 bg-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="group relative w-full py-3 bg-indigo-400 overflow-hidden font-medium transition duration-300 ease-out border border-transparent rounded-lg hover:shadow-2xl hover:border-white"
                                disabled={loading}
                            >
                                <span className="flex items-center font-semibold justify-center w-full h-full text-white">
                                    {loading ? (
                                        <Loader2 className="animate-spin w-5 h-5 mr-2" />
                                    ) : (
                                        "Verify OTP"
                                    )}
                                </span>
                            </button>

                            <div className="text-center mt-4">
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={resendLoading}
                                    className="text-indigo-400 hover:text-indigo-300 flex items-center justify-center mx-auto"
                                >
                                    <RefreshCw className={`w-4 h-4 mr-2 ${resendLoading ? 'animate-spin' : ''}`} />
                                    Resend OTP
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