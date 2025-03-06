import React, { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Sparkles, User, Folder, Upload, LogOut, ChevronDown, Menu, X } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
    const navigate = useNavigate();
    const { userData, backendUrl, setUserData, setIsLoggedin, getAuthState } = useContext(AppContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
        <nav className="w-full fixed top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between pt-5 pb-4 h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0  flex items-center">
                        <div 
                            onClick={() => navigate('/')} 
                            className="flex items-center  gap-2 cursor-pointer group"
                        >
                            <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-1 sm:p-2 rounded-lg group-hover:shadow-lg group-hover:shadow-violet-500/20 transition-all duration-300">
                                <Sparkles className="text-white w-5 h-5" />
                            </div>
                            <span className="bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent text-2xl sm:text-3xl font-bold tracking-tight">
                                XamGen
                            </span>
                        </div>
                    </div>

                    {/* Desktop menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        {userData ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all duration-200"
                                >
                                    <div className="w-7 h-7 rounded-md bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                        <span className="text-white font-semibold text-sm">
                                            {userData.name[0].toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="font-medium">
                                        {userData.name}
                                    </span>
                                    <ChevronDown
                                        className={`w-4 h-4 text-white/70 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 shadow-xl animate-in fade-in slide-in-from-top-5 duration-200">
                                        <div className="p-3 border-b border-slate-700">
                                            <p className="text-sm text-slate-400">Signed in as</p>
                                            <p className="text-sm font-medium text-white truncate">{userData.email || 'user@example.com'}</p>
                                        </div>
                                        <div className="py-1">
                                            <button
                                                onClick={() => {
                                                    navigate('/profile');
                                                    setIsDropdownOpen(false);
                                                }}
                                                className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-700/50"
                                            >
                                                <User className="w-4 h-4 text-slate-400" />
                                                <span>Profile</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    navigate('/uploadedfiles');
                                                    setIsDropdownOpen(false);
                                                }}
                                                className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-700/50"
                                            >
                                                <Upload className="w-4 h-4 text-slate-400" />
                                                <span>Uploaded Files</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    navigate('/savedpapers');
                                                    setIsDropdownOpen(false);
                                                }}
                                                className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-700/50"
                                            >
                                                <Folder className="w-4 h-4 text-slate-400" />
                                                <span>Saved Papers</span>
                                            </button>
                                        </div>
                                        <div className="py-1 border-t border-slate-700">
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    setIsDropdownOpen(false);
                                                }}
                                                className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-slate-700/50"
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
                                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all duration-200"
                            >
                                <LogIn className="w-4 h-4" />
                                <span className="font-medium">Sign In</span>
                            </button>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
                        >
                            {isMobileMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-slate-900 border-t border-slate-800">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {userData ? (
                            <>
                                <div className="flex items-center space-x-3 px-3 py-3 border-b border-slate-800">
                                    <div className="w-8 h-8 rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center">
                                        <span className="text-white font-semibold">
                                            {userData.name[0].toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-medium">{userData.name}</span>
                                        <span className="text-xs text-slate-400 truncate">{userData.email || 'user@example.com'}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        navigate('/profile');
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="flex items-center space-x-3 w-full px-3 py-2 text-base text-slate-200 hover:bg-slate-800 rounded-lg"
                                >
                                    <User className="w-5 h-5 text-slate-400" />
                                    <span>Profile</span>
                                </button>
                                <button
                                    onClick={() => {
                                        navigate('/uploadedfiles');
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="flex items-center space-x-3 w-full px-3 py-2 text-base text-slate-200 hover:bg-slate-800 rounded-lg"
                                >
                                    <Upload className="w-5 h-5 text-slate-400" />
                                    <span>Uploaded Files</span>
                                </button>
                                <button
                                    onClick={() => {
                                        navigate('/savedpapers');
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="flex items-center space-x-3 w-full px-3 py-2 text-base text-slate-200 hover:bg-slate-800 rounded-lg"
                                >
                                    <Folder className="w-5 h-5 text-slate-400" />
                                    <span>Saved Papers</span>
                                </button>
                                <button
                                    onClick={() => {
                                        logout();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="flex items-center space-x-3 w-full px-3 py-2 text-base text-red-400 hover:bg-slate-800 rounded-lg"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => {
                                    navigate('/login');
                                    setIsMobileMenuOpen(false);
                                }}
                                className="flex items-center justify-center space-x-2 w-full px-4 py-3 mt-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium"
                            >
                                <LogIn className="w-5 h-5" />
                                <span>Sign In</span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;