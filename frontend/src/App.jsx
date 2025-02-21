import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
import Upload from './pages/Upload'
import Generate from './pages/Generate'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './components/Profile';
import SavedPapers from './components/SavedPapers';

const App = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100">

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{
          zIndex: 9999,
        }}
        toastStyle={{
          backgroundColor: '#333', // Dark background
          color: '#fff', // White text
          borderRadius: '8px', // Rounded corners
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)', // Subtle shadow
        }}
        progressStyle={{
          background: 'linear-gradient(to right, #4cd964, #5ac8fa)', // Gradient progress bar
        }}
      />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/savedpapers' element={<SavedPapers />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        
        <Route path="/upload" element={<Upload />} />
        <Route path="/generate" element={<Generate />} />
      </Routes>
    </div>
  );
};

export default App;