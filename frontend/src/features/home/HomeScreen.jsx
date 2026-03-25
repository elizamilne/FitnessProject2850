// HomeScreen.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const HomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen overflow-hidden font-sans">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        className="absolute w-full h-full object-cover"
      >
        <source src="/fitness.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute w-full h-full bg-black/40 backdrop-blur-sm"></div>

      {/* Social icons */}
      <div
        className="absolute top-5 right-5 flex space-x-4 text-white text-xl animate-fadeInUp"
        style={{ animationDelay: "0.2s" }}
      >
        <a href="#" aria-label="Facebook" className="transition-transform hover:scale-110 hover:text-blue-500">
          <FaFacebook />
        </a>
        <a href="#" aria-label="Twitter" className="transition-transform hover:scale-110 hover:text-blue-400">
          <FaTwitter />
        </a>
        <a href="#" aria-label="Instagram" className="transition-transform hover:scale-110 hover:text-pink-500">
          <FaInstagram />
        </a>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        {/* Logo */}
        {/* Logo in top-left corner */}
      <img
        src="/logo.png"
        alt="SILO FITNESS"
        className="absolute top-5 left-5 w-32 sm:w-40 md:w-44 animate-fadeInUp"
        style={{ animationDelay: "0.4s" }}
      />

        {/* About Us Section - No Box */}
        <div
          className="mb-8 sm:mb-12 animate-fadeInUp"
          style={{ animationDelay: "0.6s" }}
          >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading tracking-wide mb-4">
           About Us
        </h2>
          <p className="text-base sm:text-lg md:text-xl font-body">
            We are committed to providing the best experience for our users. 
           Explore our features, connect with others, and enjoy our services.
       </p>
    </div>

        {/* Sign Up / Log In buttons */}
        <div
          className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 animate-fadeInUp"
          style={{ animationDelay: "0.8s" }}
        >
          <button
            onClick={() => navigate("/signup")}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 rounded-xl font-semibold text-lg text-white transition transform hover:scale-105 shadow-lg"
          >
            Sign Up
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 rounded-xl font-semibold text-lg text-white transition transform hover:scale-105 shadow-lg"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;