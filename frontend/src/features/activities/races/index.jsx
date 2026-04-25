import ViewAllRaceModal from "./modals/ViewAllRaceModal";
import DetailRaceModal from "./modals/DetailRaceModal";
import CreateRaceModal from "./modals/CreateRaceModal";
import RacesHeader from "./components/RacesHeader";
import RacesGrid from "./components/RacesGrid";
import RacesFooter from "./components/RacesFooter";
import useRaces from "./hooks/useRaces";

const ActivitiesRaces = () => {
  const {
    // Data state
    visisbleRacesMap,
    races,
    selectedRace,
    // Tab state
    activeTab,
    // Modal state
    isViewModalOpen,
    isCreateModalOpen,
    isDetailModalOpen,
    // State setters
    setActiveTab,
    setSelectedRace,
    // Modals setters
    setIsViewModalOpen,
    setIsCreateModalOpen,
    setIsDetailModalOpen,
    // Actions
    handleSelectRace,
  } = useRaces();

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-6">
      <RacesHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <RacesGrid
        races={races}
        visisbleRacesMap={visisbleRacesMap}
        activeTab={activeTab}
        setSelectedRace={setSelectedRace}
        setIsDetailModalOpen={setIsDetailModalOpen}
      />

      <RacesFooter
        setIsCreateModalOpen={setIsCreateModalOpen}
        setIsViewModalOpen={setIsViewModalOpen}
      />

      <ViewAllRaceModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        races={races}
        onSelect={(race) => {
          handleSelectRace(race);
        }}
      />

      <CreateRaceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={() => {
          console.log("Create race clicked");
        }}
      />

      <DetailRaceModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        race={selectedRace}
      />
    </div>
  );
};

export default ActivitiesRaces;
