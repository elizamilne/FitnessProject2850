import PrimaryNavbar from "../../common/layout/PrimaryNavbar";
import ActivitiesHistory from "./components/ActivitiesHistory";
import ActivitiesPrograms from "./programs";
import ActivitiesRaces from "./races";
import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";

const ActivitiesPage = () => {
  const pageRef = useRef(null);
  const profile = JSON.parse(sessionStorage.getItem("profile"));
  const profileId = profile?.id;

  // Smooth, non-glitch animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".animate-section", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.12,
        ease: "power2.out",
        clearProps: "all",
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#eef2ff] to-[#fdf4ff]">
      <PrimaryNavbar />

      <div
        ref={pageRef}
        className="w-[92%] lg:w-[70%] mx-auto py-12 space-y-16"
      >
        {/* Header */}
        <div className="animate-section space-y-2">
          <p className="text-gray-500 text-base">
            Track your programs, races, and history
          </p>

          <h1
            className="inline-block text-5xl font-bold tracking-tight leading-tight
            bg-gradient-to-r from-gray-900 via-indigo-600 to-purple-600
            bg-clip-text text-transparent"
          >
            Activities
          </h1>
        </div>

        {/* Programs */}
        <section className="animate-section space-y-5">
          <h3 className="text-xl font-semibold text-gray-900">Programs</h3>

          <div
            className="relative p-6 rounded-3xl
              bg-white/60 backdrop-blur-xl border border-white/50
              shadow-[0_8px_30px_rgba(0,0,0,0.05)]"
          >
            <ActivitiesPrograms 
              profileId={profileId}
            />

            <div className="absolute inset-0 rounded-3xl pointer-events-none
              bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5"
            />
          </div>
        </section>

        {/* Races */}
        <section className="animate-section space-y-5">
          <h3 className="text-xl font-semibold text-gray-900">Races</h3>

          <div
            className="relative p-6 rounded-3xl
              bg-white/60 backdrop-blur-xl border border-white/50
              shadow-[0_8px_30px_rgba(0,0,0,0.05)]"
          >
            <ActivitiesRaces 
              profileId={profileId}
            />

            <div className="absolute inset-0 rounded-3xl pointer-events-none
              bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5"
            />
          </div>
        </section>

        {/* History */}
        <section className="animate-section space-y-5">
          <h3 className="text-xl font-semibold text-gray-900">History</h3>

          <div
            className="relative p-6 rounded-3xl
              bg-white/60 backdrop-blur-xl border border-white/50
              shadow-[0_8px_30px_rgba(0,0,0,0.05)]"
          >
            <ActivitiesHistory 
              profileId={profileId}
            />

            <div className="absolute inset-0 rounded-3xl pointer-events-none
              bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default ActivitiesPage;