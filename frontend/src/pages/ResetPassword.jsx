import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Zap, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();
    const { backendUrl, userData } = useContext(AppContext);

    const handleSendOtp = async (e) => {
        e.preventDefault();

        setLoading(true); // Set loading state to true

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
            setLoading(false); // Set loading state to false after the request is complete
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();

        setLoading(true); // Set loading state to true

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
            setLoading(false); // Set loading state to false after the request is complete
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        if (userData) {
            navigate("/");
        }
    }, [userData, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div onClick={() => navigate('/')} className="cursor-pointer absolute left-4 md:left-14 lg:left-24 top-6 flex items-center gap-3">
                <div className="bg-indigo-500/20 p-2 rounded-full animate-pulse">
                    <Zap className="text-indigo-500 w-10 h-10" />
                </div>
                <span className="text-indigo-500 text-3xl font-semibold tracking-wider">
                    XamGen
                </span>
            </div>
            <div className="w-full max-w-md bg-gradient-to-br rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-4 py-10">
                    <h2 className="text-3xl font-bold text-indigo-500 text-center mb-4">Reset Password</h2>
                    <p className="text-zinc-400 text-center mb-8">
                        {otpSent
                            ? 'Enter the OTP sent to your email and your new password.'
                            : 'Enter your registered email address to receive an OTP.'}
                    </p>
                    {!otpSent ? (
                        <form onSubmit={handleSendOtp} className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    type="email"
                                    placeholder="Email ID"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg text-black placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="group relative w-full py-3 bg-indigo-400 overflow-hidden font-medium transition duration-300 ease-out border border-transparent rounded-lg hover:shadow-2xl hover:border-white"
                            >
                                <span className="flex items-center font-semibold justify-center w-full h-full text-white">
                                    {loading ? (
                                        <Loader2 className="animate-spin w-5 h-5 mr-2" />
                                    ) : (
                                        'Submit'
                                    )}
                                </span>
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleOtpSubmit} className="space-y-4">
                            <div className="relative">
                                <input
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    type="text"
                                    placeholder="Enter OTP"
                                    className="w-full pl-4 pr-4 py-3  rounded-lg text-black placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <input
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter New Password"
                                    className="w-full pl-4 pr-10 py-3  rounded-lg text-black placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
                            <button
                                type="submit"
                                className="group relative w-full py-3 bg-indigo-400 overflow-hidden font-medium transition duration-300 ease-out border border-transparent rounded-lg hover:shadow-2xl hover:border-white"
                            >
                                <span className="flex items-center font-semibold justify-center w-full h-full text-white">
                                    {loading ? (
                                        <Loader2 className="animate-spin w-5 h-5 mr-2" />
                                    ) : (
                                        'Submit'
                                    )}
                                </span>
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
