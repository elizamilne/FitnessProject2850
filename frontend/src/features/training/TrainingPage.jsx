import TrainingCalendar from "./components/TrainingCalendar";
import TrainingContentList from "./components/TrainingContentList";
import TrainingOverviewRow from "./components/TrainingOverviewRow";
import TrainingStatistics from "./components/TrainingStatistics";
import TrainingProgramSelector from "./components/TrainingProgramSelector";
import { programService } from "../../services/program";
import { useEffect, useState } from "react";
import AppNavbar from "../../common/layout/PrimaryNavbar";

const TrainingPage = () => {
  const [programs, setPrograms] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);

  // Updates the currently selected date
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedProgram(null);
    setPrograms([]);
  };

  // Updates the currently selected program
  const handleProgramChange = (program) => {
    setSelectedProgram(program);
  };

  // Loads programs when selectedDate changes
  useEffect(() => {
    if (!selectedDate) return;

    const loadPrograms = async () => {
      try {
        const profileId = 1;
        const { data } = await programService.getByProfileAndDate(
          profileId,
          selectedDate,
        );

        setPrograms(data);
      } catch (error) {
        console.error("Failed:", error.response?.data);
      }
    };

    loadPrograms();
  }, [selectedDate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#eef2ff] to-[#fdf4ff]">
      <AppNavbar />

      <div className="w-[92%] lg:w-[70%] mx-auto py-12 space-y-14">
        {/* Header */}
        <div className="flex items-center justify-between">
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

            <h2
              className="text-4xl font-bold tracking-tight
                   bg-gradient-to-r from-gray-900 via-indigo-600 to-purple-600
                   bg-clip-text text-transparent"
            >
              Training
            </h2>
          </div>
        </div>

        {/* Calendar */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Calendar</h3>

          <TrainingCalendar
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
          />
        </div>

        {/* Workouts */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-800">Workouts</h3>

          <div className="relative p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
            <TrainingProgramSelector
              programs={programs}
              selectedProgram={selectedProgram}
              onProgramChange={handleProgramChange}
            />

            <TrainingContentList
              program={selectedProgram}
              date={selectedDate}
            />

            {/* subtle glow */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
          </div>
        </div>

        {/* Statistics */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Statistics</h3>

          <TrainingStatistics />
        </div>

        {/* Overview */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Overview</h3>

          <TrainingOverviewRow />
        </div>
      </div>
    </div>
  );
};

export default TrainingPage;
