import React from 'react';
import LoginForm from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';
import bannerImage from '../assets/ubb_logo_inicio.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const navigate = useNavigate();

  const showAlert = (type, message) => {
    if (type === 'success') {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  if (localStorage.getItem('user')) {
    return (
      <>
        <h2>Ya estás logeado!</h2>
        <button onClick={() => navigate('/')}>Ir a home</button>
      </>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-light-yellow">
      <div className="header-footer-bg w-full"></div>
      <div className="max-w-4xl w-full flex flex-col items-center justify-center p-8">
        <img
          src={bannerImage}
          alt="Banner"
          className="banner-image mb-4"
          style={{ transform: 'translateX(-35px)' }}
        />
        <div className="w-full max-w-md">
          <LoginForm showAlert={showAlert} />
        </div>
      </div>
      <div className="header-footer-bg w-full"></div>
      <ToastContainer />
    </div>
  );
}

export default Login;
