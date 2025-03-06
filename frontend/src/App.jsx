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
import UploadedFiles from './components/UploadedFiles';

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
        theme="dark"
        style={{
          zIndex: 9999,
        }}
        toastStyle={{
          backgroundColor: '#1e293b', // Slate-800 background
          color: '#f1f5f9', // Slate-100 text
          borderRadius: '0.75rem', // Larger rounded corners
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)', // More prominent shadow
          border: '1px solid #334155', // Slate-700 border
          fontSize: '0.95rem',
          padding: '12px 16px',
        }}
        progressStyle={{
          background: 'linear-gradient(to right, #8b5cf6, #6366f1)', // Violet to indigo gradient
          height: '4px',
        }}
      />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/savedpapers' element={<SavedPapers />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/uploadedfiles' element={<UploadedFiles />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/generate" element={<Generate />} />
      </Routes>
    </div>
  );
};

export default App;