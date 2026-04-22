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
    <div className="w-[90%] mx-auto">
      {/* Section Title */}
      <h2 className="text-xl font-semibold mb-4">Overview</h2>

      {/* Row */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Left */}
        {nextRace && (
          <div className="bg-white p-5 rounded-2xl shadow-sm flex-1 flex flex-col items-center justify-center text-center">
            <h4 className="text-sm text-gray-500">Next Race</h4>
            <p className="text-lg font-semibold mt-1">
              {formatRaceDate(nextRace.date)}
            </p>
          </div>
        )}

        {/* Right */}
        <div className="bg-white p-5 rounded-2xl shadow-sm flex-1">
          <h4 className="text-sm text-gray-500 mb-2">Personal Records</h4>

          {/* <ul className="space-y-1 text-sm text-gray-700">
          
            <li>5km - 30m</li>
            <li>10km - 1h 10m</li>
            <li>Half Marathon - 2h 30m</li>
          </ul> */}
          <ul className="space-y-1 text-sm text-gray-700">
            {personalBests.length === 0 ? (
              <li className="text-gray-400">No records yet</li>
            ) : (
              personalBests.map((item) => (
                <li key={`${item.exerciseId}-${item.metricTypeId}`}>
                  {item.exerciseName} - {item.bestValue}{item.metricUnit} {item.metricName}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TrainingOverviewRow;
