import ActivitiesControlGrid from "../../../../common/ui/activities/ActivitiesControlGrid";

const RacesGrid = ({ races, onSelect }) => {
  return (
    <ActivitiesControlGrid
      items={races}
      emptyText="No races found"
      placeholderText="Race"
      onSelect={onSelect}
      renderSubtitle={(race) =>
        `${new Date(race.date).toLocaleDateString()} • ${race.location}`
      }
    />
  );
};

export default RacesGrid;
