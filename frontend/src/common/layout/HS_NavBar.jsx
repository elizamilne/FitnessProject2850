import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 
      bg-white/10 backdrop-blur-xl border-b border-white/10 text-white">

      <div className="w-[92%] lg:w-[70%] mx-auto flex justify-between items-center py-5">
        
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="
            text-xl font-semibold cursor-pointer select-none
            bg-gradient-to-r from-white via-indigo-300 to-purple-400
            bg-clip-text text-transparent
            hover:opacity-80
            transition
          "
        >
          SILA
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          
          {/* Login */}
          <button
            onClick={() => navigate("/login")}
            className="
              px-5 py-2 text-sm sm:text-base font-medium rounded-lg
              bg-white/10 border border-white/20
              text-white
              hover:bg-white/20
              active:scale-95
              transition-all duration-200
            "
          >
            Login
          </button>

          {/* Register */}
          <button
            onClick={() => navigate("/signup")}
            className="
              px-5 py-2 text-sm sm:text-base font-semibold rounded-lg
              bg-gradient-to-r from-indigo-500 to-purple-500
              text-white
              hover:opacity-90
              active:scale-95
              transition-all duration-200
              shadow-[0_4px_20px_rgba(99,102,241,0.35)]
            "
          >
            Register
          </button>

        </div>
      </div>
    </nav>
  );
}