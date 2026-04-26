import ActivitiesControlHeader from "../../../../common/ui/activities/ActivitiesControlHeader";

const RacesHeader = ({ activeTab, setActiveTab }) => {
  return (
    <ActivitiesControlHeader
      title="Races"
      options={[
        { label: "Upcoming", value: "upcoming" },
        { label: "Completed", value: "completed" },
      ]}
      value={activeTab}
      onChange={setActiveTab}
    />
  );
};

export default RacesHeader;
