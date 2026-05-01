import ActivitiesControlGrid from "../../../../common/ui/activities/ActivitiesControlGrid";
import { formatDays } from "../utils/formatters";

const ProgramsGrid = ({ programs, onSelect }) => {
  return (
    <ActivitiesControlGrid
      items={programs}
      emptyText="No programs found"
      placeholderText="Program"
      onSelect={onSelect}
      renderSubtitle={(program) =>
        formatDays(program.weeklyFrequency) || "No schedule"
      }
    />
  );
};

export default ProgramsGrid;
