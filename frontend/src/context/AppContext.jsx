import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios"; 

export const AppContext = createContext()

export const AppContextProvider = (props) => {
    
    axios.defaults.withCredentials = true  // on reloading user is displayed

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedin, setIsLoggedin] = useState(false)
    const [userData, setUserData] = useState(false)

    // getting user data 
    const getUserData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/data`, {
                withCredentials: true, // Ensure cookies are sent with the request
            });

            if (data.success) {
                // Successfully fetched user data
                setUserData(data.userData);
                // console.log("User data:", data.userData);
            } else {
                toast.error(data.message || "Failed to fetch user data");
            }
        } catch (error) {
            toast.error(error.message)
        }
    };


    // get user authorised or not
    const getAuthState = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/auth/is-auth');
            if (data.success) {
                setIsLoggedin(true);
                getUserData();  // Fetch user data if authenticated
            } else {
                setIsLoggedin(false);
                setUserData(false);
            }
        } catch (error) {
            setIsLoggedin(false);
            setUserData(false);
            toast.error("Failed to check authentication status");
        }
    };    
    useEffect(()=>{
        getAuthState();
    },[])


    const value = {
        backendUrl,
        isLoggedin,setIsLoggedin,
        userData,setUserData,
        getUserData,
        getAuthState,
    }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}