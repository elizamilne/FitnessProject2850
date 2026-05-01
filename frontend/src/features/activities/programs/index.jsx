import usePrograms from "./hooks/usePrograms";

import ViewAllProgramModal from "./modals/ViewAllProgramModal";
import DetailProgramModal from "./modals/DetailProgramModal/index";
import CreateProgramModal from "./modals/CreateProgramModal";

import ProgramsHeader from "./components/ProgramsHeader";
import ProgramsGrid from "./components/ProgramsGrid";
import ProgramsFooter from "./components/ProgramsFooter";

const ActivitiesPrograms = ({ profileId }) => {
  const {
    programs,
    visibleProgramsMap,
    activeTab,
    selectedProgram,

    setActiveTab,
    setSelectedProgram,

    isViewModalOpen,
    isCreateModalOpen,
    isDetailModalOpen,

    setIsViewModalOpen,
    setIsCreateModalOpen,
    setIsDetailModalOpen,

    handleSelectProgram,
    handleCreateProgram,
    handleUpdateProgram,
  } = usePrograms(profileId);

  const visiblePrograms = visibleProgramsMap[activeTab] || [];

  return (
    <div className="space-y-6">
      <ProgramsHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <div>
        <ProgramsGrid
          programs={visiblePrograms}
          onSelect={(program) => {
            setSelectedProgram(program);
            setIsDetailModalOpen(true);
          }}
        />
      </div>

      <ProgramsFooter
        setIsCreateModalOpen={() => setIsCreateModalOpen(true)}
        setIsViewModalOpen={() => setIsViewModalOpen(true)}
      />

      <ViewAllProgramModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        programs={programs}
        onSelect={handleSelectProgram}
      />

      <CreateProgramModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateProgram}
      />

      <DetailProgramModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        program={selectedProgram}
        onUpdate={handleUpdateProgram}
      />
    </div>
  );
};

export default ActivitiesPrograms;