import { useEffect, useState } from "react";
import { raceService } from "../../../services/race";
import { activityService } from "../../../services/activity";
import { CalendarDays } from "lucide-react";

const TrainingOverviewRow = ({ profileId }) => {
  const [nextRace, setNextRace] = useState(null);
  const [personalBests, setPersonalBests] = useState([]);

  useEffect(() => {
    const loadNextRace = async () => {
      try {
        if (!profileId) return; 

        const { data } = await raceService.getNextRace(profileId);
        setNextRace(data);
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error(error);
        }
      }
    };

    loadNextRace();
  }, [profileId]);

  useEffect(() => {
    const loadPersonalBest = async () => {
      try {
        if (!profileId) return;

        const { data } = await activityService.getBestActivity(profileId);

        const top5 = data.slice(0, 5);
        setPersonalBests(top5);
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error(error);
        }
      }
    };

    loadPersonalBest();
  }, [profileId]);

  const formatRaceDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();

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
    <div className="w-[100%] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row gap-5">
        {/* Next Race (always visible) */}
        <div
          className="relative flex-1 p-6 rounded-3xl
             bg-white/70 backdrop-blur-xl border border-white/50
             shadow-[0_10px_40px_rgba(0,0,0,0.06)]
             flex items-center gap-6"
        >
          {/* Icon */}
          <div className="flex-1 flex items-center justify-center">
            {/* <CalendarDays size={80} className="text-indigo-500/70" /> */}
            <img src="/calendar-icon.svg" alt="" />
          </div>

          {/* Content */}
          <div className="flex-1 text-center sm:text-left">
            <h4 className="text-sm text-gray-500 mb-2">Next Race</h4>

            {nextRace ? (
              <p className="text-2xl font-semibold text-gray-900 tracking-tight">
                {formatRaceDate(nextRace.date)}
              </p>
            ) : (
              <div className="space-y-1">
                <p className="text-base font-semibold text-gray-500">
                  No race scheduled
                </p>
                <p className="text-sm text-gray-400">
                  Add a race to stay motivated
                </p>
              </div>
            )}
          </div>

          {/* glow */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none 
               bg-gradient-to-br from-indigo-500/5 to-purple-500/5"
          />
        </div>

        {/* Personal Records */}
        <div
          className="relative flex-1 p-6 rounded-3xl
                      bg-white/70 backdrop-blur-xl border border-white/50
                      shadow-[0_10px_40px_rgba(0,0,0,0.06)]"
        >
          <h4 className="text-sm text-gray-500 mb-3">Personal Records</h4>

          <ul className="space-y-2 text-sm">
            {personalBests.length === 0 ? (
              <li className="text-gray-400 text-center py-6">
                No records yet. Start training to track your best results.
              </li>
            ) : (
              personalBests.map((item, index) => (
                <li
                  key={`${item.exerciseId}-${item.metricTypeId}`}
                  className={`
                    flex items-center justify-between
                    py-3 transition
                    ${
                      index !== personalBests.length - 1
                        ? "border-b border-gray-200/60"
                        : ""
                    }
                  `}
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

          {/* glow */}
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
