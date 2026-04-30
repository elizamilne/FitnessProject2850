import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { gsap } from "gsap";
import { Menu, X } from "lucide-react";

export default function PrimaryNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const overlayRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  // Detect screen size + auto close
  useLayoutEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (!mobile) setOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  // GSAP animation
  useLayoutEffect(() => {
    if (!overlayRef.current || !open) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        }
      );

      gsap.fromTo(
        ".menu-link",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.45,
          ease: "power3.out",
          delay: 0.1,
        }
      );
    }, overlayRef);

    return () => ctx.revert();
  }, [open]);

  const handleNav = (path) => {
    navigate(path);
    setOpen(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("profile");

    navigate("/login");
  };

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white">
        <div className="w-[92%] lg:w-[70%] mx-auto flex items-center justify-between py-6 relative">

          {/* LEFT: Logo */}
          <div
            onClick={() => navigate("/training-page")}
            className="text-xl font-semibold text-gray-900 cursor-pointer z-10"
          >
            SILA
          </div>

          {/* CENTER: Navigation */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-12">
            <button
              onClick={() => navigate("/training-page")}
              className={`text-base font-medium transition ${isActive("/training-page")
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-800"
                }`}
            >
              Training
            </button>

            <button
              onClick={() => navigate("/activities-page")}
              className={`text-base font-medium transition ${isActive("/activities-page")
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-800"
                }`}
            >
              Activities
            </button>

            <button
              onClick={() => navigate("/chats")}
              className={`text-base font-medium transition ${isActive("/chats")
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-800"
                }`}
            >
              Chats
            </button>
          </div>

          {/* RIGHT: Logout */}
          <div className="hidden md:flex items-center gap-4 z-10">
            <button
              onClick={handleLogout}
              className="
        text-base font-medium
        text-gray-500 hover:text-gray-800
        transition
        relative
        after:absolute after:left-0 after:-bottom-1
        after:h-[2px] after:w-0
        after:bg-gradient-to-r after:from-indigo-500 after:to-purple-500
        after:transition-all after:duration-300
        hover:after:w-full
      "
            >
              Logout
            </button>
          </div>

          {/* Burger */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/90 backdrop-blur-xl border border-indigo-100 shadow-[0_6px_20px_rgba(0,0,0,0.08)] text-gray-800 hover:bg-white hover:text-gray-900 transition-colors duration-200"
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* Fullscreen Menu (mobile only) */}
      {open && isMobile && (
        <div
          ref={overlayRef}
          className="
            fixed inset-0 z-[999]
            bg-[#4b3f47] text-white
            flex flex-col justify-between
            px-8 py-10
          "
        >
          {/* Top */}
          <div className="flex items-center justify-between">
            <div className="text-xl font-semibold">SILA</div>

            <button onClick={() => setOpen(false)}>
              <X size={28} />
            </button>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-6 mt-10">
            {[
              { label: "Training", path: "/training-page" },
              { label: "Activities", path: "/activities-page" },
              { label: "Chats", path: "/chats" },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className="
                  menu-link text-left
                  text-4xl font-semibold
                  tracking-tight
                "
              >
                {item.label}
              </button>
            ))}

          </div>

          {/* Bottom */}
          <div className="flex flex-col gap-6 text-gray-300">

            <button
              onClick={() => {
                handleLogout();
                setOpen(false);
              }}
              className="
                menu-link text-left
                text-2xl font-semibold
                text-red-400 hover:text-red-300
              "
            >
              Logout
            </button>

            <div className="text-sm">© 2025 SILA</div>
          </div>

        </div>
      )}
    </>
  );
}