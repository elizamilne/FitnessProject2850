/*import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Email: ${email}\nPassword: ${password}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
*/

import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Email: ${email}\nPassword: ${password}`);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      
      {/*  Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute w-full h-full object-cover"
      >
        <source src="/fitness.mp4" type="video/mp4" />
      </video>

      {/*  Dark overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/*  Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
        
        {/*  Title */}
        <img
          src="/logo.png"
          alt="SILO FITNESS"
          className="w-60 mb-8"
        />

        {/*  Login Box */}
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-sm">
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg font-semibold"
            >
              Sign In
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}