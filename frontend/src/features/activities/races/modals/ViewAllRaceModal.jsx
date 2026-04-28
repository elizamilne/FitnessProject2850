import ActivitiesViewAllModal from "../../../../common/ui/activities/ActivitiesViewAllModal";

const ViewAllRaceModal = ({
  isOpen,
  onClose,
  races = [],
  onSelect,
}) => {
  return (
    <ActivitiesViewAllModal
      isOpen={isOpen}
      onClose={onClose}
      items={races}
      title="Select Race"
      emptyText="No races found"
      onSelect={onSelect}
      renderSubtitle={(race) =>
        `${new Date(race.date).toLocaleDateString()} • ${race.location}`
      }
    />
    
  );
};

export default ViewAllRaceModal;