import { useNavigate } from "react-router-dom";

export default function AppNavbar() {
  const navigate = useNavigate();

  return (
    <nav className="relative top-0 left-0 w-full flex justify-center items-center px-6 py-4 z-50 bg-black/30 backdrop-blur-md text-white">
      
      {/* Navigation links */}
      <div className="flex space-x-8">
        <button
          onClick={() => navigate("/training-page")}
          className="text-lg hover:text-gray-300 transition"
        >
          Training
        </button>

        <button
          onClick={() => navigate("/activities-page")}
          className="text-lg hover:text-gray-300 transition"
        >
          Activities
        </button>
      </div>

    </nav>
  );
}