import { useEffect, useState } from "react";
import { raceService } from "../../../../services/race";

const useRaces = (profileId) => {
  const [races, setRaces] = useState([]);

  const [visisbleRacesMap, setVisibleRacesMap] = useState({
    upcoming: [],
    completed: [],
  });

  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedRace, setSelectedRace] = useState(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    const loadRaces = async () => {
      try {
        if (!profileId) return;

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
  }, [activeTab, profileId]);

  const handleCreateRace = (newRace) => {
    setRaces((prev) => [newRace, ...prev]);

    setVisibleRacesMap((prev) => ({
      ...prev,
      [activeTab]: [newRace, ...(prev[activeTab] || [])].slice(0, 3),
    }));
  };

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
    // Data
    races,
    visisbleRacesMap,
    selectedRace,

    // Tab state
    activeTab,

    // Tab control
    setActiveTab,
    setSelectedRace,
    
    // Modal state
    isViewModalOpen,
    isCreateModalOpen,
    isDetailModalOpen,
    
    // Modal setters
    setIsViewModalOpen,
    setIsCreateModalOpen,
    setIsDetailModalOpen,

    // Actions 
    handleSelectRace,
    handleCreateRace
  };
};

export default useRaces;