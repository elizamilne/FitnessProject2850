import ActivitiesControlFooter from "../../../../common/ui/activities/ActivitiesControlFooter";

const ProgramsFooter = ({ setIsCreateModalOpen, setIsViewModalOpen }) => {
  return (
    <ActivitiesControlFooter
      onCreate={() => setIsCreateModalOpen(true)}
      onViewAll={() => setIsViewModalOpen(true)}
    />
  );
};

export default ProgramsFooter;
