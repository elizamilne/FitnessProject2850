import usePrograms from "./hooks/usePrograms";

import ViewAllProgramModal from "./modals/ViewAllProgramModal";
import DetailProgramModal from "./modals/DetailProgramModal";
import CreateProgramModal from "./modals/CreateProgramModal";

import ProgramsHeader from "./components/ProgramsHeader";
import ProgramsGrid from "./components/ProgramsGrid";
import ProgramsFooter from "./components/ProgramsFooter";

const ActivitiesPrograms = () => {
  const {
    // Data
    programs,
    visibleProgramsMap,
    activeTab,
    selectedProgram,

    // Tab control
    setActiveTab,
    setSelectedProgram,

    // Actions
    handleSelectProgram,

    // Modal state
    isViewModalOpen,
    isCreateModalOpen,
    isDetailModalOpen,

    // Modal setters
    setIsViewModalOpen,
    setIsCreateModalOpen,
    setIsDetailModalOpen,
  } = usePrograms();

  return (
    <div className="space-y-6">
      <ProgramsHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <ProgramsGrid
        programs={visibleProgramsMap[activeTab]}
        onSelect={(program) => {
          setSelectedProgram(program);
          setIsDetailModalOpen(true);
        }}
      />

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
        onCreate={(program) => {
          console.log("Create program:", program);
        }}
      />

      <DetailProgramModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        program={selectedProgram}
      />
    </div>
  );
};

export default ActivitiesPrograms;
