import { useNavigate, useLocation } from "react-router-dom";

export default function PrimaryNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white">
      <div className="w-[92%] lg:w-[70%] mx-auto flex items-center justify-between py-6">
        {/* Left */}
        <div
          onClick={() => navigate("/training-page")}
          className="text-xl font-semibold text-gray-900 cursor-pointer"
        >
          SILA
        </div>

        {/* Center */}
        <div className="flex items-center gap-12">
          <button
            onClick={() => navigate("/training-page")}
            className={`
          text-base font-medium transition
          ${
            isActive("/training-page")
              ? "text-gray-900"
              : "text-gray-500 hover:text-gray-800"
          }
        `}
          >
            Training
          </button>

          <button
            onClick={() => navigate("/activities-page")}
            className={`
          text-base font-medium transition
          ${
            isActive("/activities-page")
              ? "text-gray-900"
              : "text-gray-500 hover:text-gray-800"
          }
        `}
          >
            Activities
          </button>

          <button
            onClick={() => navigate("/chats")}
            className={`
          text-base font-medium transition
          ${
            isActive("/chats")
              ? "text-gray-900"
              : "text-gray-500 hover:text-gray-800"
          }
        `}
          >
            Chats
          </button>
        </div>

        {/* Right */}
        <div className="w-12" />
      </div>
    </nav>
  );
}
