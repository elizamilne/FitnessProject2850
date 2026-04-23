import { useState } from "react";
import { User, UserCheck, Mail, Lock, KeyRound } from "lucide-react";
import { userService } from "../../services/user";
import { useNavigate } from "react-router-dom";
import BackgroundVideo from "../../common/ui/BackgroundVideo";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    rePassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.rePassword) {
      setError("Passwords do not match");
      return;
    }

    const { _, ...dataWithoutRePass } = formData;

    try {
      const user = await userService.register(dataWithoutRePass);
      console.log(user);

      const userId = user?.data.id;

      if (!userId) {
        throw new Error("User ID not returned from server");
      }

      sessionStorage.setItem("userId", userId);

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        rePassword: "",
      });

      setError("");

      navigate("/questions");
    } catch (err) {
      setError("Registration failed");
      console.error(err);
    }
  };

  return (
    <div className="relative z-10 flex items-center justify-center min-h-screen px-4 bg-gray-400">
      <BackgroundVideo />

      <form
        onSubmit={handleSubmit}
        className="bg-black/40 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md text-white"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Create Account</h2>

        {/* First + Last Name */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          {/* First Name */}
          <div className="flex items-center bg-white/10 rounded-lg px-3 w-full">
            <User className="text-gray-300 mr-2" size={18} />
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-3 bg-transparent focus:outline-none placeholder-gray-300"
              required
            />
          </div>

          {/* Last Name */}
          <div className="flex items-center bg-white/10 rounded-lg px-3 w-full">
            <UserCheck className="text-gray-300 mr-2" size={18} />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-3 bg-transparent focus:outline-none placeholder-gray-300"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center bg-white/10 rounded-lg px-3 mb-4">
          <Mail className="text-gray-300 mr-2" size={18} />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 bg-transparent focus:outline-none placeholder-gray-300"
            required
          />
        </div>

        {/* Password */}
        <div className="flex items-center bg-white/10 rounded-lg px-3 mb-4">
          <Lock className="text-gray-300 mr-2" size={18} />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 bg-transparent focus:outline-none placeholder-gray-300"
            required
          />
        </div>

        {/* Re-enter Password */}
        <div className="flex items-center bg-white/10 rounded-lg px-3 mb-4">
          <KeyRound className="text-gray-300 mr-2" size={18} />
          <input
            type="password"
            name="rePassword"
            placeholder="Re-enter Password"
            value={formData.rePassword}
            onChange={handleChange}
            className="w-full p-3 bg-transparent focus:outline-none placeholder-gray-300"
            required
          />
        </div>

        {/* Error */}
        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        {/* Button */}
        <button
          type="submit"
          className="w-full py-3 mt-2 bg-gradient-to-r from-gray-800 to-black hover:from-gray-600 hover:to-gray-900 rounded-xl font-bold transition duration-300"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
