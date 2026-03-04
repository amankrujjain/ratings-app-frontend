import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import errorAnimation from "../assets/lottie/404 Error Lottie animation.json"; // change filename if needed

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 px-4">

      {/* Lottie Animation */}
      <div className="w-80 md:w-96">
        <Lottie animationData={errorAnimation} loop={true} />
      </div>

      {/* Text */}
      <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-6">
        404
      </h1>

      <p className="text-slate-600 text-center mt-2 max-w-md">
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </p>

      {/* Button */}
      <button
        onClick={() => navigate("/")}
        className="
          mt-6
          block text-center
          select-none rounded 
          bg-slate-800 
          py-3 px-6 
          text-sm font-semibold text-white 
          shadow-md shadow-slate-900/10 
          transition-all 
          hover:shadow-lg hover:shadow-slate-900/20 
          active:opacity-[0.85]
        "
      >
        Go Back Home
      </button>

    </div>
  );
}

export default NotFound;