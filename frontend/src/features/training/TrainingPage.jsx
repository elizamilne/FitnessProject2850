import TrainingCalendar from "./components/TrainingCalendar/index";
import TrainingContentList from "./components/TrainingContentList";
import TrainingOverviewRow from "./components/TrainingOverviewRow";
import TrainingStatistics from "./components/TrainingStatistics";
import TrainingProgramSelector from "./components/TrainingProgramSelector";
import { programService } from "../../services/program";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import PrimaryNavbar from "../../common/layout/PrimaryNavbar";
import { Helmet } from "react-helmet-async";

const TrainingPage = () => {
  const [programs, setPrograms] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const profile = JSON.parse(sessionStorage.getItem("profile"));
  const profileId = profile?.id;

  // Root ref for GSAP scope
  const pageRef = useRef(null);

  // Updates selected date
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedProgram(null);
    setPrograms([]);
  };

  // Updates selected program
  const handleProgramChange = (program) => {
    setSelectedProgram(program);
  };

  // Load programs when date changes
  useEffect(() => {
    if (!selectedDate) return;

    const loadPrograms = async () => {
      try {
        if (!profileId) return;

        const { data } = await programService.getByProfileAndDate(
          profileId,
          selectedDate
        );

        setPrograms(data);
      } catch (error) {
        console.error("Failed:", error.response?.data);
      }
    };

    loadPrograms();
  }, [selectedDate, profileId]);

  // Stable GSAP animation (no glitches)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".animate-section",
        {
          y: 12,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.35,
          ease: "power2.out",
          stagger: 0.015,
          overwrite: "auto",
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  // Animate workouts content when program changes (no glitch)
  useEffect(() => {
    if (!selectedProgram) return;

    gsap.from(".workouts-content", {
      y: 15,
      opacity: 0,
      duration: 0.4,
      ease: "power2.out",
    });
  }, [selectedProgram]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#eef2ff] to-[#fdf4ff]">
      <Helmet>
        <title>SILA | Training</title>
        <meta
          name="description"
          content="Track your workouts, programs, races, and training progress."
        />
      </Helmet>
      
      <PrimaryNavbar />

      <div
        ref={pageRef}
        className="w-[92%] lg:w-[70%] mx-auto py-12 space-y-14"
      >
        {/* Header */}
        <div className="animate-section flex items-center justify-between">
          <div>
            <h1 className="text-base text-gray-500 font-medium">
              {selectedDate
                ? new Date(selectedDate).toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })
                : "Select a date"}
            </h1>

            <h1
              className="inline-block text-5xl font-bold tracking-tight leading-tight
              bg-gradient-to-r from-gray-900 via-indigo-600 to-purple-600
              bg-clip-text text-transparent"
            >
              Training
            </h1>
          </div>
        </div>

        {/* Calendar */}
        <div className="animate-section space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Calendar</h3>

          <TrainingCalendar
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
          />
        </div>

        {/* Workouts */}
        <div className="animate-section space-y-6">
          <h3 className="text-xl font-semibold text-gray-800">Workouts</h3>

          <div className="relative p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">

            {selectedDate && (
              <TrainingProgramSelector
                programs={programs}
                selectedProgram={selectedProgram}
                onProgramChange={handleProgramChange}
              />
            )}

            {selectedProgram && (
              <div className="workouts-content">
                <TrainingContentList
                  program={selectedProgram}
                  date={selectedDate}
                />
              </div>
            )}

            {/* glow */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
          </div>
        </div>

        {/* Statistics */}
        <div className="animate-section space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Statistics</h3>

          <TrainingStatistics
            profileId={profileId}
          />
        </div>

        {/* Overview */}
        <div className="animate-section space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Overview</h3>

          <TrainingOverviewRow
            profileId={profileId}
          />
        </div>
      </div>
    </div>
  );
};

export default TrainingPage;