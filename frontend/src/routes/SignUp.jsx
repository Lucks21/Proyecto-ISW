import SignUpForm from "../components/SignUpForm";
import { useNavigate } from "react-router-dom";
import bannerImage from '../assets/ubb_logo_inicio.png';

function SignUp() {
  const navigate = useNavigate();

  if (localStorage.getItem("user")) {
    return (
      <>
        <h2>Ya estas logeado!</h2>
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
          <SignUpForm />
        </div>
      </div>
      <div className="header-footer-bg w-full"></div>
    </div>
  );
}

export default SignUp;
