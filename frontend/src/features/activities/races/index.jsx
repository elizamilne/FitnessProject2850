import ViewAllRaceModal from "./modals/ViewAllRaceModal";
import DetailRaceModal from "./modals/DetailRaceModal";
import CreateRaceModal from "./modals/CreateRaceModal";
import RacesHeader from "./components/RacesHeader";
import RacesGrid from "./components/RacesGrid";
import RacesFooter from "./components/RacesFooter";
import useRaces from "./hooks/useRaces";

const ActivitiesRaces = ({ profileId }) => {
  const {
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
    handleCreateRace
  } = useRaces(profileId);

  const visibleRaces = visisbleRacesMap[activeTab] || [];

  return (
    <div className="space-y-6">
      <RacesHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* prevent layout jump */}
      <div className="min-h-[140px]">
        <RacesGrid
          races={visibleRaces}
          onSelect={(race) => {
            setSelectedRace(race);
            setIsDetailModalOpen(true);
          }}
        />
      </div>

      <RacesFooter
        setIsCreateModalOpen={setIsCreateModalOpen}
        setIsViewModalOpen={setIsViewModalOpen}
      />

      <ViewAllRaceModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        races={races}
        onSelect={handleSelectRace}
      />

      <CreateRaceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateRace}
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