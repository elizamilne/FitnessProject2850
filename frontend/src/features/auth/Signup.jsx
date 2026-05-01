import { useState } from "react";
import { User, UserCheck, Mail, Lock, KeyRound } from "lucide-react";
import { userService } from "../../services/user";
import { useNavigate } from "react-router-dom";
import AuthInput from "../../common/ui/auth/AuthInput";
import AnimatedError from "../../common/ui/AnimatedError";
import { validateRegister } from "./utils/registerValidation";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    rePassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateRegister(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const { _, ...dataWithoutRePass } = formData;

    try {
      const user = await userService.register(dataWithoutRePass);

      const userToken = user?.data["token"];
      const userData = user?.data["user"];
      const userId = userData.id;

      if (!userId) throw new Error("User ID not returned from server");

      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("token", userToken);

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        rePassword: "",
      });

      setErrors({});
      navigate("/questions");
    } catch (err) {
      console.error(err);
      setErrors({ api: "Registration failed" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="
          relative z-10 w-full max-w-md
          p-8 rounded-3xl
          bg-white/10 backdrop-blur-xl
          border border-white/10
          shadow-[0_10px_40px_rgba(0,0,0,0.4)]
          text-white
        "
      >
        <div className="absolute inset-0 rounded-3xl pointer-events-none bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />

        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Create Account
          </h2>

          {/* API Error */}
          <AnimatedError
            message={errors.api}
            className="text-center mb-4"
          />

          {/* First + Last Name */}
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <div className="flex-1">
              <AuthInput
                icon={<User size={18} />}
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
              <AnimatedError message={errors.firstName} />
            </div>

            <div className="flex-1">
              <AuthInput
                icon={<UserCheck size={18} />}
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
              <AnimatedError message={errors.lastName} />
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <AuthInput
              icon={<Mail size={18} />}
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            <AnimatedError message={errors.email} />
          </div>

          {/* Password */}
          <div className="mb-4">
            <AuthInput
              icon={<Lock size={18} />}
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <AnimatedError message={errors.password} />
          </div>

          {/* Re-enter Password */}
          <div className="mb-4">
            <AuthInput
              icon={<KeyRound size={18} />}
              type="password"
              name="rePassword"
              placeholder="Re-enter Password"
              value={formData.rePassword}
              onChange={handleChange}
            />
            <AnimatedError message={errors.rePassword} />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="
              w-full py-3 mt-2 rounded-xl font-semibold
              bg-gradient-to-r from-indigo-500 to-purple-500
              text-white
              hover:opacity-90
              active:scale-95
              transition-all duration-200
              shadow-[0_6px_25px_rgba(99,102,241,0.4)]
            "
          >
            Sign Up
          </button>

          <p className="text-sm text-gray-400 text-center mt-4">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-indigo-300 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;