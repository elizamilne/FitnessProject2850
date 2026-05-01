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

        setVisibleRacesMap((prev) => ({
          ...prev,
          [activeTab]: data.slice(0, 3),
        }));

        setSelectedRace(null);
      } catch (err) {
        console.error("Failed to load races", err);
      }
    };

    loadRaces();
  }, [activeTab, profileId]);

  const handleCreateRace = (newRace) => {
    setRaces((prev) => [newRace, ...prev]);

    const targetTab = newRace.completed ? "completed" : "upcoming";

    setVisibleRacesMap((prev) => ({
      ...prev,
      [targetTab]: [newRace, ...(prev[targetTab] || [])].slice(0, 3),
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

  const handleUpdateRace = (updatedRace) => {
    if (updatedRace.deleted) {
      setRaces((prev) =>
        prev.filter((race) => race.id !== updatedRace.id)
      );

      setVisibleRacesMap((prev) => ({
        upcoming: prev.upcoming.filter((race) => race.id !== updatedRace.id),
        completed: prev.completed.filter((race) => race.id !== updatedRace.id),
      }));

      setSelectedRace(null);
      setIsDetailModalOpen(false);
      return;
    }

    setRaces((prev) => {
      const exists = prev.some((race) => race.id === updatedRace.id);

      if (!exists) return prev;

      return prev.map((race) =>
        race.id === updatedRace.id ? updatedRace : race
      );
    });

    setVisibleRacesMap((prev) => {
      const removeFromUpcoming = prev.upcoming.filter(
        (race) => race.id !== updatedRace.id
      );

      const removeFromCompleted = prev.completed.filter(
        (race) => race.id !== updatedRace.id
      );

      if (updatedRace.completed) {
        return {
          upcoming: removeFromUpcoming,
          completed: [updatedRace, ...removeFromCompleted].slice(0, 3),
        };
      }

      return {
        upcoming: [updatedRace, ...removeFromUpcoming].slice(0, 3),
        completed: removeFromCompleted,
      };
    });

    setSelectedRace(updatedRace);
  };

  return {
    races,
    visisbleRacesMap,
    selectedRace,

    activeTab,

    setActiveTab,
    setSelectedRace,

    isViewModalOpen,
    isCreateModalOpen,
    isDetailModalOpen,

    setIsViewModalOpen,
    setIsCreateModalOpen,
    setIsDetailModalOpen,

    handleSelectRace,
    handleCreateRace,
    handleUpdateRace,
  };
};

export default useRaces;