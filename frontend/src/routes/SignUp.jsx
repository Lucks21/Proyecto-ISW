import React from "react";
import SignUpForm from "../components/SignUpForm";
import { useNavigate } from "react-router-dom";
import bannerImage from '../assets/ubb_logo_inicio.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SignUp() {
  const navigate = useNavigate();

  const showAlert = (type, message) => {
    if (type === "success") {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  if (localStorage.getItem("user")) {
    return (
      <>
        <h2>Ya estás logeado!</h2>
        <button onClick={() => navigate("/")}>Ir a home</button>
      </>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-between bg-light-yellow">
      <div className="header-footer-bg w-full"></div>
      <div className="flex-grow flex flex-col items-center justify-center p-8">
        <img
          src={bannerImage}
          alt="Banner"
          className="banner-image mb-4"
          style={{ transform: 'translateX(0px)' }}
        />
        <div className="w-full max-w-md">
          <SignUpForm showAlert={showAlert} />
        </div>
      </div>
      <div className="header-footer-bg w-full"></div>
      <ToastContainer />
    </div>
  );
}

export default SignUp;
