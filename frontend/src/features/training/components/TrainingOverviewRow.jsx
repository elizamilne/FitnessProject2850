import { useEffect, useState } from "react";
import { raceService } from "../../../services/race";
import { activityService } from "../../../services/activity";

const TrainingOverviewRow = () => {
  const [nextRace, setNextRace] = useState(null);
  const [personalBests, setPersonalBests] = useState([]);

  useEffect(() => {
    const loadNextRace = async () => {
      try {
        const profileId = 1;
        const { data } = await raceService.getNextRace(profileId);
        console.log(data);
        setNextRace(data);
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error(error);
        }
      }
    };

    loadNextRace();
  }, []);

  useEffect(() => {
    const loadPersonalBest = async () => {
      try {
        const profileId = 1;

        const { data } = await activityService.getBestActivity(profileId);

        const top5 = data.slice(0, 5);
        setPersonalBests(top5);
        console.log("BEST", top5);
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error(error);
        }
      }
    };

    loadPersonalBest();
  }, []);

  const formatRaceDate = (dateString) => {
    const date = new Date(dateString);

    const day = date.getDate();

    // ordinal suffix
    const getSuffix = (d) => {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    const month = date.toLocaleString("en-GB", { month: "long" });

    return `${day}${getSuffix(day)} ${month}`;
  };

  return (
    <div className="w-[90%] mx-auto space-y-6">
      {/* Row */}
      <div className="flex flex-col sm:flex-row gap-5">
        {/* 🔹 NEXT RACE */}
        {nextRace && (
          <div
            className="relative flex-1 p-6 rounded-3xl
                        bg-white/70 backdrop-blur-xl border border-white/50
                        shadow-[0_10px_40px_rgba(0,0,0,0.06)]
                        flex flex-col items-center justify-center text-center"
          >
            <h4 className="text-sm text-gray-500 mb-1">Next Race</h4>

            <p className="text-2xl font-semibold text-gray-900 tracking-tight">
              {formatRaceDate(nextRace.date)}
            </p>

            {/* subtle glow */}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none 
                          bg-gradient-to-br from-indigo-500/5 to-purple-500/5"
            />
          </div>
        )}

        {/* 🔹 PERSONAL RECORDS */}
        <div
          className="relative flex-1 p-6 rounded-3xl
                      bg-white/70 backdrop-blur-xl border border-white/50
                      shadow-[0_10px_40px_rgba(0,0,0,0.06)]"
        >
          <h4 className="text-sm text-gray-500 mb-3">Personal Records</h4>

          <ul className="space-y-2 text-sm">
            {personalBests.length === 0 ? (
              <li className="text-gray-400">No records yet</li>
            ) : (
              personalBests.map((item) => (
                <li
                  key={`${item.exerciseId}-${item.metricTypeId}`}
                  className="flex items-center justify-between
                           px-3 py-2 rounded-lg
                           bg-white/60 hover:bg-white/80
                           transition"
                >
                  <span className="text-gray-700 truncate">
                    {item.exerciseName}
                  </span>

                  <span className="font-medium text-gray-900">
                    {item.bestValue}
                    <span className="text-gray-500 ml-1 text-xs">
                      {item.metricUnit}
                    </span>
                  </span>
                </li>
              ))
            )}
          </ul>

          {/* subtle glow */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none 
                        bg-gradient-to-br from-indigo-500/5 to-purple-500/5"
          />
        </div>
      </div>
    </div>
  );
};

export default TrainingOverviewRow;
