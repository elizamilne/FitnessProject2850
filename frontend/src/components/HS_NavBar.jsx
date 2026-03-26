import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-4 z-50 bg-black/30 backdrop-blur-md text-white">
      
      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        className="flex items-center cursor-pointer"
      >
        <img src="/logo.png" alt="SILO FITNESS" className="w-15 sm:w-32" />
      </div>

    {/* Auth buttons */}
    <div className="flex space-x-4">
      <button
        onClick={() => navigate("/login")}
        className="px-5 py-2 text-lg border border-white rounded-lg hover:bg-white hover:text-black transition"
      >
      Login
    </button>

  <button
    onClick={() => navigate("/signup")}
    className="px-5 py-2 text-lg bg-white text-black rounded-lg hover:bg-gray-200 transition"
  >
    Register
  </button>
</div>

    </nav>
  );
}