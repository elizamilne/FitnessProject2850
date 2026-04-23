import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import BackgroundVideo from "../../common/ui/BackgroundVideo";
import { userService } from "../../services/user";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {email, password}
      const result = await userService.login(data);

      if (result.ok || result.success) {
        setEmail("");
        setPassword("");
      }

    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div>
      <BackgroundVideo />

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-black/40 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md text-white"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>

          {/* Email */}
          <div className="flex items-center bg-white/10 rounded-lg px-3 mb-4">
            <Mail className="text-gray-300 mr-2" size={18} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-transparent focus:outline-none placeholder-gray-300"
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center bg-white/10 rounded-lg px-3 mb-4">
            <Lock className="text-gray-300 mr-2" size={18} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-transparent focus:outline-none placeholder-gray-300"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-gray-800 to-black rounded-xl font-bold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
