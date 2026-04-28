import PublicNavbar from "./PublicNavbar";
import BackgroundVideo from "../ui/BackgroundVideo";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const PublicLayout = () => {
  const location = useLocation();
  const contentRef = useRef(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // animate IN on route change
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
      },
    );
  }, [location.pathname]);
 
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Navbar */}
      <PublicNavbar />

      {/* Background */}
      <BackgroundVideo />

      {/* Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.65)_100%)]" />
      </div>

      {/* This is where pages change */}
      <div ref={contentRef} className="relative z-10">
        <Outlet />
      </div>
    </div>
  );
};

export default PublicLayout;
