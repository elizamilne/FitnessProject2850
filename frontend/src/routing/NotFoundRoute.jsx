import { useNavigate } from "react-router-dom";

const NotFoundRoute = () => {
  const navigate = useNavigate();

  return (
    <div
      className="
        h-screen
        flex items-center justify-center
        px-4 sm:px-6
        relative overflow-hidden
        bg-gradient-to-br from-[#f8fafc] via-[#eef2ff] to-[#fdf4ff]
      "
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08),transparent_60%)]" />

      {/* Ambient blobs */}
      <div className="absolute -top-28 -left-28 w-64 sm:w-80 h-64 sm:h-80 bg-indigo-400/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-28 -right-28 w-64 sm:w-80 h-64 sm:h-80 bg-purple-400/20 rounded-full blur-3xl" />

      {/* Wrapper */}
      <div className="relative w-full max-w-md sm:max-w-2xl">

        {/* Card */}
        <div
          className="
            px-6 sm:px-10 py-6 sm:py-8 rounded-3xl
            bg-white/90 backdrop-blur-xl
            border border-white/70
            shadow-[0_25px_60px_rgba(0,0,0,0.08)]
          "
        >
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 tracking-tight">
            404
          </h1>

          <p className="mt-3 text-sm sm:text-base text-gray-500">
            Page not found
          </p>

          <p className="mt-2 text-base sm:text-lg font-semibold text-gray-800 max-w-md">
            The page you’re looking for doesn’t exist or has been moved.
          </p>

          <button
            onClick={() => navigate("/")}
            className="
              mt-5 sm:mt-6 px-6 py-3 rounded-xl text-sm font-semibold
              bg-gradient-to-r from-indigo-500 to-purple-500
              text-white
              hover:opacity-90 active:scale-95
              transition
              shadow-[0_6px_25px_rgba(99,102,241,0.4)]
            "
          >
            Go Home
          </button>
        </div>

        {/* Illustration */}
        <div
          className="
            absolute pointer-events-none

            /* Mobile */
            -right-4 -top-8

            /* Desktop */
            sm:-right-2 sm:-top-16
            md:-right-4 md:-top-20

            w-36 sm:w-44 md:w-52
          "
        >
          <img
            src="/error404.svg"
            alt="Not found"
            className="w-full drop-shadow-[0_10px_25px_rgba(0,0,0,0.15)]"
          />
        </div>
      </div>
    </div>
  );
};

export default NotFoundRoute;