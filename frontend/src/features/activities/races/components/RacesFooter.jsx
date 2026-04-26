import ActivitiesControlFooter from "../../../../common/ui/activities/ActivitiesControlFooter";

const RacesFooter = ({ setIsCreateModalOpen, setIsViewModalOpen }) => {
  return (
    <ActivitiesControlFooter
      onCreate={() => setIsCreateModalOpen(true)}
      onViewAll={() => setIsViewModalOpen(true)}
    />
  );
};

export default RacesFooter;
