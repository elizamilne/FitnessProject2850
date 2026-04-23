import { useEffect, useState } from "react";
import { raceService } from "../../../../services/race";

const useRaces = () => {
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

        const response =
          activeTab === "upcoming"
            ? await raceService.getUpcoming(profileId)
            : await raceService.getCompleted(profileId);

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
        console.error("Failed to load races", err);
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

  return {
    visisbleRacesMap,
    activeTab,
    races,
    selectedRace,
    isViewModalOpen,
    isCreateModalOpen,
    isDetailModalOpen,
    setActiveTab,
    setSelectedRace,
    setIsViewModalOpen,
    setIsCreateModalOpen,
    setIsDetailModalOpen,
    handleSelectRace,
  };
};

export default useRaces;