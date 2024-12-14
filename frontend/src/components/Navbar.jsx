import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, ShieldCheck } from 'lucide-react';
import { AppContext } from '../context/AppContext'; // Import context
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {

    const navigate = useNavigate();
    const { userData, backendUrl, setUserData, setIsLoggedin, getAuthState } = useContext(AppContext); // Access getAuthState from context

    const logout = async () => {
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.post(backendUrl + '/api/auth/logout');
    
            if (data.success) {
                toast.success("Logged out successfully");
                setIsLoggedin(false);
                setUserData(false);
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
            <div className="mx-auto px-4 sm:px-6 2xl:px-32">
                <div className="flex justify-between items-center py-6">
                    {/* Logo */}
                    <div className="flex items-center">
                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-500/20 p-2 rounded-full animate-pulse">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center">
                                    <ShieldCheck className="text-emerald-400 w-10 h-10" />
                                </div>
                            </div>
                            <span className="text-white text-3xl 2xl:text-4xl font-semibold tracking-wider">
                                AUTH
                            </span>
                        </div>
                    </div>
                    {userData ?
                        <div className=' cursor-pointer w-12 h-12 text-3xl font-bold flex justify-center items-center rounded-full bg-white relative group'>
                            {userData.name[0].toUpperCase()}
                            <div className='absolute cursor-pointer top-12 right-0 pt-4 dropdown-menu bg-white rounded-lg shadow-lg transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100 group-hover:block z-50'>
                                <div className='flex flex-col w-36'>
                                    <p className='font-normal cursor-pointer px-4 py-2 text-base hover:bg-gray-100 transition-colors duration-200 rounded-t-lg'>Verify Email</p>
                                    <p onClick={logout} className='font-normal cursor-pointer px-4 py-2 text-base text-red-600 hover:bg-gray-100 transition-colors duration-200 rounded-b-lg'>Logout</p>
                                </div>
                            </div>
                        </div>
                        : <button onClick={() => navigate('/login')} className="group relative inline-flex items-center justify-center px-8 py-2.5 overflow-hidden font-medium transition duration-300 ease-out border border-emerald-500 rounded-full hover:shadow-2xl hover:border-transparent">
                            <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-emerald-500 group-hover:translate-x-0 ease">
                                <LogIn className="w-5 h-5 ml-2" />
                            </span>
                            <span className="absolute flex items-center justify-center w-full h-full text-emerald-500 transition-all duration-300 transform group-hover:translate-x-full ease">
                                Login
                            </span>
                            <span className="relative invisible">Login</span>
                        </button>
                    }
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
