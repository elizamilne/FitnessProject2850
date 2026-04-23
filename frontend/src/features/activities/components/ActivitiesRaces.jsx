import { Plus } from "lucide-react";
import { raceService } from "../../../services/race";
import { useEffect, useState } from "react";
import Modal from "../../../common/ui/Modal";

const ActivitiesRaces = () => {
  const [visisbleRacesMap, setVisibleRacesMap] = useState({
    upcoming: [],
    completed: [],
  });

  const [activeTab, setActiveTab] = useState("upcoming");
  const [races, setRaces] = useState([]);
  const [selectedRace, setSelectedRace] = useState(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    const loadRaces = async () => {
      try {
        const profileId = 1;

        let response;

        if (activeTab === "upcoming") {
          response = await raceService.getUpcoming(profileId);
        } else {
          response = await raceService.getCompleted(profileId);
        }

        const data = response.data;

        setRaces(data);
        setVisibleRacesMap((prev) => {
          if (prev[activeTab].length > 0) return prev;

          return {
            ...prev,
            [activeTab]: data.slice(0, 3),
          };
        });
        setSelectedRace(null);
      } catch (err) {
        console.error("Failed to load programs", err);
      }
    };

    loadRaces();
  }, [activeTab]);

  const handleSelectRace = (race) => {
    setSelectedRace(race);

    setVisibleRacesMap((prev) => {
      const current = prev[activeTab];

      const filtered = current.filter((p) => p.id !== race.id);
      const updated = [race, ...filtered].slice(0, 3);

      return {
        ...prev,
        [activeTab]: updated,
      };
    });

    setIsViewModalOpen(false);
  };

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
            onClick={() => setActiveTab("completed")}
            className={`relative px-4 py-2 text-sm z-10 text-center ${
              activeTab === "completed" ? "text-black" : "text-gray-500"
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Race Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {races.length === 0 ? (
          <p className="text-gray-500 text-sm">No races found</p>
        ) : (
          visisbleRacesMap[activeTab].map((race) => (
            <div
              key={race.id}
              className="relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition h-32"
              onClick={() => {
                setSelectedRace(race);
                setIsDetailModalOpen(true);
              }}
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
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-9 h-9 shrink-0 flex items-center justify-center border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition"
        >
          <Plus size={18} />
        </button>

        <button
          onClick={() => setIsViewModalOpen(true)}
          className="group relative inline-flex items-center gap-1 text-sm text-blue-600"
        >
          View All
          <span className="transition-transform duration-200 group-hover:translate-x-[2px]">
            →
          </span>
          <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-blue-600 transition-all duration-300 group-hover:w-full" />
        </button>
      </div>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        header={<h3 className="text-lg font-semibold">Select Race</h3>}
        body={
          <div className="space-y-2">
            {races.length === 0 ? (
              <p className="text-sm text-gray-500">No races found</p>
            ) : (
              races.map((race) => (
                <div
                  key={race.id}
                  onClick={() => {
                    console.log("Selected program:", race);
                    handleSelectRace(race);
                    setIsViewModalOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                >
                  <img
                    src={race.bannerUrl || "https://via.placeholder.com/60"}
                    alt={race.title}
                    className="w-12 h-12 rounded-md object-cover"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{race.title}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {new Date(race.date).toLocaleDateString()} * {race.location}
                    </p>
                  </div>

                  <span className="text-xs text-gray-400">→</span>
                </div>
              ))
            )}
          </div>
        }
      />

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        header={<h3 className="text-lg font-semibold">Create Race</h3>}
        body={
          <div>
            <p>Create The Race</p>
          </div>
        }
      />

      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        header={<h3 className="text-lg font-semibold">View Race</h3>}
        body={
          selectedRace ? (
            <div className="space-y-3">
              <img
                src={
                  selectedRace.bannerUrl ||
                  "https://via.placeholder.com/300x200"
                }
                className="w-full h-40 object-cover rounded-lg"
              />

              <h4 className="text-lg font-semibold">{selectedRace.title}</h4>

              <p className="text-sm text-gray-500">
                {new Date(selectedRace.date).toLocaleDateString()} * {selectedRace.location}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No race selected</p>
          )
        }
      />
    </div>
  );
};

export default ActivitiesRaces;
