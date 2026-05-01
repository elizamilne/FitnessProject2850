import ActivitiesViewAllModal from "../../../../common/ui/activities/ActivitiesViewAllModal";
import Modal from "../../../../common/ui/Modal";
import { formatDays } from "../utils/formatters";

const ViewAllProgramModal = ({
  isOpen,
  onClose,
  programs = [],
  onSelect,
}) => {
  return (
    <ActivitiesViewAllModal
      isOpen={isOpen}
      onClose={onClose}
      items={programs}
      title="Select Program"
      emptyText="No programs found"
      onSelect={onSelect}
      renderSubtitle={(program) =>
        formatDays(program.weeklyFrequency) || "No schedule"
      }
    />
  );
};

export default ViewAllProgramModal;
