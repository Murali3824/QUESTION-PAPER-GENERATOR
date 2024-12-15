import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, ShieldCheck, ChevronDown } from 'lucide-react'; // Import the dropdown icon (ChevronDown)
import { AppContext } from '../context/AppContext'; // Import context
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
    const navigate = useNavigate();
    const { userData, backendUrl, setUserData, setIsLoggedin, getAuthState } = useContext(AppContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Toggle dropdown visibility
    const toggleDropdown = () => {
        setIsDropdownOpen((prevState) => !prevState);
    };

    // Logout function
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
                    <div onClick={() => navigate('/')} className="cursor-pointer flex items-center gap-1 sm:gap-3">
                                    <div className="bg-indigo-500/20 p-2 rounded-full animate-pulse">
                                        <ShieldCheck className="text-indigo-400 w-7 h-7 sm:w-10 sm:h-10" />
                                    </div>
                                    <span className="text-white text-2xl sm:text-3xl font-semibold tracking-wider">
                                        AUTHFLOW
                                    </span>
                                </div>

                    {/* Conditional rendering for logged-in user */}
                    {userData ? (
                        <div className="relative flex items-center  rounded-3xl bg-indigo-400 px-2">
                            {/* Display the user's first letter */}
                            <div 
                                className="cursor-pointer w-12 h-12 text-3xl font-bold flex justify-center items-center bg-indigo-400 text-white rounded-l-3xl" 
                                onClick={toggleDropdown}
                            >
                                {userData.name[0].toUpperCase()}
                            </div>

                            {/* Dropdown icon */}
                            <div onClick={toggleDropdown}>
                                <ChevronDown 
                                    className={`w-7 h-8 cursor-pointer text-white transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                                />
                            </div>

                            {/* Dropdown menu */}
                            {isDropdownOpen && (
                                <div className="absolute top-14 right-0 bg-gradient-to-br from-gray-100 to-gray-200 shadow-xl w-44 rounded-lg">
                                <div className="flex flex-col w-full">
                                    <p 
                                        onClick={logout} 
                                        className="cursor-pointer  py-3 text-red-600 text-center hover:bg-gray-300 rounded-lg text-md font-semibold tracking-wide transition-colors duration-200"
                                    >
                                        Logout
                                    </p>
                                </div>
                            </div>
                            
                            )}
                        </div>
                    ) : (
                        <button 
                            onClick={() => navigate('/login')} 
                            className="group relative inline-flex items-center justify-center px-6 sm:px-8 py-1.5 sm:py-3 overflow-hidden font-medium transition duration-300 ease-out border  rounded-full hover:shadow-2xl hover:border-transparent"
                        >
                            <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-indigo-400 group-hover:translate-x-0 ease">
                                <LogIn className="w-5 h-5 ml-2" />
                            </span>
                            <span className="absolute flex items-center justify-center w-full h-full font-semibold text-xl text-white transition-all duration-300 transform group-hover:translate-x-full ease">
                                Login
                            </span>
                            <span className="relative invisible ">Login</span>
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
