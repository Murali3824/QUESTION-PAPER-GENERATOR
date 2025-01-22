import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, ShieldCheck, User, LogOut, ChevronDown } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
    const navigate = useNavigate();
    const { userData, backendUrl, setUserData, setIsLoggedin, getAuthState } = useContext(AppContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const logout = async () => {
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.post(`${backendUrl}/api/auth/logout`);

            if (data.success) {
                toast.success("Logged out successfully");
                setIsLoggedin(false);
                setUserData(null);
                getAuthState();
                navigate('/');
            } else {
                toast.error(data.message || "Logout failed");
            }
        } catch (error) {
            toast.error(error.message || "An error occurred during logout");
        }
    };

    return (
        <nav className="w-full absolute top-0 z-50">
            <div className="mx-auto px-4 md:px-14 lg:px-24">
                <div className="flex justify-between items-center py-6">
                    {/* Logo */}
                    <div onClick={() => navigate('/')} className="cursor-pointer flex items-center gap-3">
                        <div className="bg-indigo-500/20 p-2 rounded-full animate-pulse">
                            <ShieldCheck className="text-indigo-400 w-10 h-10" />
                        </div>
                        <span className="text-white text-3xl font-semibold tracking-wider">
                            AUTHFLOW
                        </span>
                    </div>

                    {/* Auth Section */}
                    <div className="flex items-center">
                        {userData ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                                >
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                                            <span className="text-white font-medium">
                                                {userData.name[0].toUpperCase()}
                                            </span>
                                        </div>
                                        <span className="hidden sm:block text-slate-200">
                                            {userData.name}
                                        </span>
                                    </div>
                                    <ChevronDown
                                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-lg bg-slate-800 border border-slate-700 shadow-xl">
                                        <div className="py-1">
                                            <button
                                                onClick={() => {
                                                    navigate('/profile');
                                                    setIsDropdownOpen(false);
                                                }}
                                                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-slate-200 hover:bg-slate-700"
                                            >
                                                <User className="w-4 h-4" />
                                                <span>Profile</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    setIsDropdownOpen(false);
                                                }}
                                                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-slate-700"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
                            >
                                <LogIn className="w-4 h-4" />
                                <span>Login</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;