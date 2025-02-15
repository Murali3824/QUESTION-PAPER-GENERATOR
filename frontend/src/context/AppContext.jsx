import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";


export const AppContext = createContext()


export const AppContextProvider = (props) => {
    
    axios.defaults.withCredentials = true  // on reloading user is displayed


    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [isLoggedin, setIsLoggedin] = useState(false)
    const [userData, setUserData] = useState(false)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [generatedPaper, setGeneratedPaper] = useState(null); 

    const handleError = (error) => {
        setError(error.response?.data?.error || error.message || 'An error occurred');
        setLoading(false);
    };

    
    // getting user data
    const getUserData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/data`, {
                withCredentials: true, // Ensure cookies are sent with the request
            });
            console.log(data);


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
            setLoading(true); // Add this
            const { data } = await axios.get(backendUrl + '/api/auth/is-auth');
            if (data.success) {
                setIsLoggedin(true);
                await getUserData();
            } else {
                setIsLoggedin(false);
                setUserData(false);
            }
        } catch (error) {
            setIsLoggedin(false);
            setUserData(false);
        } finally {
            setLoading(false); // Add this
        }
    };

    useEffect(() => {
        getAuthState();
    }, []);

    const uploadFile = async (file) => {
        try {
            setLoading(true);
            setError(null);
    
            const formData = new FormData();
            formData.append('file', file);
    
            const response = await axios.post(`${backendUrl}/api/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            // console.log("Upload response:", response);
            setLoading(false);
            return response.data || {}; 
        } catch (error) {
            handleError(error);
            throw error;
        }
    };


    const generatePaper = async (config) => {
        try {
            setLoading(true);
            setError(null);
    
            const response = await axios.post(`${backendUrl}/api/generate`, config);
            // console.log("Generate Paper Response Data:", response.data); 
    
            setGeneratedPaper(response.data);
            setLoading(false);
            return response.data;
        } catch (error) {
            handleError(error);
            console.error("Error generating paper:", error); 
            throw error;
        }
    };
    
    const getSubjects = async () => {
        try {
            setLoading(true);
            setError(null);
    
            const response = await axios.get(`${backendUrl}/api/generate/subjects`);
    
            // console.log("Full API Response:", response.data);
    
            if (!response.data || !Array.isArray(response.data.subjects)) {
                throw new Error("Invalid API response format");
            }
    
            setSubjects(response.data.subjects);
            setLoading(false);
            return response.data.subjects;
        } catch (error) {
            handleError(error);
            throw error;
        }
    };

    const clearError = () => setError(null);
    const clearGeneratedPaper = () => setGeneratedPaper(null);



    const value = {
        backendUrl,
        isLoggedin,setIsLoggedin,
        userData,setUserData,
        getUserData,
        getAuthState,
        // State
        loading,
        error,
        subjects,
        generatedPaper,

        // API Actions
        uploadFile,
        generatePaper,
        getSubjects,

        // Utility Actions
        clearError,
        clearGeneratedPaper
    }


    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

