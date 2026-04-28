import React from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import BackgroundVideo from "../../common/ui/BackgroundVideo";
import PublicNavbar from "../../common/layout/PublicNavbar";

const HomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen overflow-hidden font-sans">
      {/* Navbar */}
      <PublicNavbar />

      {/* Background video */}
      <BackgroundVideo />

      {/* Overlay stack */}
      <div className="absolute inset-0 z-0">
        {/* Subtle dark tint */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Brand gradient (lighter) */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-black/40" />

        {/* Focus vignette (THIS is the trick) */}
        <div
          className="absolute inset-0 
    bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.65)_100%)]"
        />
      </div>

      {/* Social icons */}
      <div className="absolute bottom-6 right-6 flex gap-4 text-white text-xl z-20">
        <a className="hover:scale-110 hover:text-blue-400 transition">
          <FaFacebook />
        </a>
        <a className="hover:scale-110 hover:text-blue-300 transition">
          <FaTwitter />
        </a>
        <a className="hover:scale-110 hover:text-pink-400 transition">
          <FaInstagram />
        </a>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 pt-20 space-y-8">
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
    </div>
  );
};

export default HomeScreen;
