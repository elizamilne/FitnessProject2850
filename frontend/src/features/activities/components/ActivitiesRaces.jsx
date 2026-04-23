import { Plus } from "lucide-react";
import { raceService } from "../../../services/race";
import { useEffect, useState } from "react";

const ActivitiesRaces = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [races, setRaces] = useState([]);

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const profileId = 1;

        let response;

        if (activeTab === "upcoming") {
          response = await raceService.getUpcoming(profileId);
        } else {
          response = await raceService.getCompleted(profileId);
        }

        setRaces(response.data);
      } catch (err) {
        console.error("Failed to load programs", err);
      }
    };

    loadPrograms();
  }, [activeTab]);

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Races</h2>

        {/* Tabs */}
        <div className="relative grid grid-cols-2 bg-gray-100 p-1 rounded-full w-fit">
          {/* Sliding background */}
          <div
            className={`absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] bg-white rounded-full shadow transition-transform duration-300
            ${activeTab === "upcoming" ? "translate-x-0" : "translate-x-full"}
            `}
          />

          <button
            onClick={() => setActiveTab("upcoming")}
            className={`relative px-4 py-2 text-sm z-10 text-center ${
              activeTab === "upcoming" ? "text-black" : "text-gray-500"
            }`}
          >
            Upcoming
          </button>

          <button
            onClick={() => setActiveTab("past")}
            className={`relative px-4 py-2 text-sm z-10 text-center ${
              activeTab === "past" ? "text-black" : "text-gray-500"
            }`}
          >
            Past
          </button>
        </div>
      </div>

      {/* Race Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {races.length === 0 ? (
          <p className="text-gray-500 text-sm">No races found</p>
        ) : (
          races.slice(0, 3).map((race) => (
            <div
              key={race.id}
              className="relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition h-32"
            >
              <img
                src={
                  race.bannerUrl ||
                  "https://via.placeholder.com/300x200?text=Race"
                }
                alt={race.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />

              <div className="relative h-full flex items-center px-4">
                <div className="text-white">
                  <h3 className="font-semibold text-lg">{race.title}</h3>

                  <p className="text-sm text-white/80">
                    {new Date(race.date).toLocaleDateString()} * {race.location}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <button className="w-9 h-9 shrink-0 flex items-center justify-center border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition">
          <Plus size={18} />
        </button>

        <button className="group relative inline-flex items-center gap-1 text-sm text-blue-600">
          View All
          <span className="transition-transform duration-200 group-hover:translate-x-[2px]">
            →
          </span>
          <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-blue-600 transition-all duration-300 group-hover:w-full" />
        </button>
      </div>
    </div>
  );
};

export default ActivitiesRaces;
