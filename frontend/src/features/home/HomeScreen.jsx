import React from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const HomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center text-center px-6 pt-20 space-y-8 font-sans">
      {/* Social icons */}
      <div className="absolute bottom-6 right-6 flex gap-4 text-white z-20">
        <a className="hover:scale-110 hover:text-blue-400 transition">
          <FaFacebook size={24} />
        </a>
        <a className="hover:scale-110 hover:text-blue-300 transition">
          <FaTwitter size={24} />
        </a>
        <a className="hover:scale-110 hover:text-pink-400 transition">
          <FaInstagram size={24} />
        </a>
      </div>

      {/* Headline */}
      <h1
        className="
          text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight
          bg-gradient-to-r from-white via-indigo-300 to-purple-400
          bg-clip-text text-transparent
        "
      >
        Train smarter. Perform better.
      </h1>

      {/* Subtext */}
      <p className="max-w-xl text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed">
        Plan workouts, track performance, and stay consistent — without the
        guesswork.
      </p>

      {/* CTA */}
      <button
        onClick={() => navigate("/signup")}
        className="
          mt-4 px-10 py-4 text-lg font-semibold rounded-xl
          bg-gradient-to-r from-indigo-500 to-purple-500
          text-white
          hover:opacity-90
          active:scale-95
          transition-all duration-200
          shadow-[0_6px_25px_rgba(99,102,241,0.4)]
        "
      >
        Get Started
      </button>

      {/* Value strip */}
      <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-sm text-gray-400">
        <span>✔ Build training programs</span>
        <span>✔ Track every workout</span>
        <span>✔ See your progress</span>
      </div>
    </div>
  );
};

export default HomeScreen;
