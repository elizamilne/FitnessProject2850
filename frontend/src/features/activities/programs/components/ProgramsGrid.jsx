import ActivitiesControlGrid from "../../../../common/ui/activities/ActivitiesControlGrid";
import { sortDays } from "../utils/formatters";

const ProgramsGrid = ({ programs, onSelect }) => {
  return (
    <ActivitiesControlGrid
      items={programs}
      emptyText="No programs found"
      placeholderText="Program"
      onSelect={onSelect}
      renderSubtitle={(program) =>
        sortDays(program.weeklyFrequency).join(", ") || "No schedule"
      }
    />
  );
};

export default ProgramsGrid;
