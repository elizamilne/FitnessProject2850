import React, { useState } from "react";
import Navbar from "../components/HS_NavBar";
import { useNavigate } from "react-router-dom";

const SignUp = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    console.log(formData);

    navigate("/questions");
  };

  return (
    <div className="relative w-full h-screen overflow-hidden font-sans">
      
      {/* Navbar */}
      

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
      <div className="absolute w-full h-full bg-black/50 backdrop-blur-sm"></div>

      {/* Form */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-black/40 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md text-white"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">
            Create Account
          </h2>

          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full mb-4 p-3 rounded-lg bg-white/10 focus:outline-none"
            required
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mb-4 p-3 rounded-lg bg-white/10 focus:outline-none"
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full mb-4 p-3 rounded-lg bg-white/10 focus:outline-none"
            required
          />

          {/* Confirm Password */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Re-enter Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full mb-4 p-3 rounded-lg bg-white/10 focus:outline-none"
            required
          />

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm mb-3">{error}</p>
          )}

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 mt-2 bg-gradient-to-r from-gray-800 to-black hover:from-gray-600 hover:to-gray-900 rounded-xl font-bold transition duration-300"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;