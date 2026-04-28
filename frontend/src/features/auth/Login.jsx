import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import BackgroundVideo from "../../common/ui/BackgroundVideo";
import { userService } from "../../services/user";
import { useNavigate } from "react-router-dom";
import { profileService } from "../../services/profile";
import AuthInput from "../../common/ui/auth/AuthInput";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await userService.login({ email, password });

      const user = res?.data || res;
      const userId = user?.id || user?.userId;

      if (!userId) throw new Error("No userId returned");

      try {
        const profileRes = await profileService.getUserProfile(userId);
        const profile = profileRes?.data || profileRes;

        sessionStorage.setItem("profile", JSON.stringify(profile));
        navigate("/dashboard");
      } catch (profileErr) {
        console.error("No profile found: ", profileErr);
        sessionStorage.setItem("userId", userId);
        navigate("/questions");
      }

      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">

      {/* Background video */}
      <BackgroundVideo />

      {/* Overlay (same as everywhere else) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.65)_100%)]" />
      </div>

      {/* Form */}
      <div className="relative z-10 w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="
            relative p-8 rounded-3xl
            bg-white/10 backdrop-blur-xl
            border border-white/10
            shadow-[0_10px_40px_rgba(0,0,0,0.4)]
            text-white
          "
        >
          {/* Glow */}
          <div className="absolute inset-0 rounded-3xl pointer-events-none bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />

          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Welcome Back
            </h2>

            {/* Email */}
            <div className="mb-4">
              <AuthInput
                icon={<Mail size={18} />}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <AuthInput
                icon={<Lock size={18} />}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="
                w-full py-3 rounded-xl font-semibold
                bg-gradient-to-r from-indigo-500 to-purple-500
                text-white
                hover:opacity-90
                active:scale-95
                transition-all duration-200
                shadow-[0_6px_25px_rgba(99,102,241,0.4)]
              "
            >
              Login
            </button>

            {/* Link */}
            <p className="text-sm text-gray-400 text-center mt-4">
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-indigo-300 cursor-pointer hover:underline"
              >
                Sign up
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}