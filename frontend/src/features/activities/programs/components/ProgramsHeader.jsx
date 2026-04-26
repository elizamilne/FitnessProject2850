import ActivitiesControlHeader from "../../../../common/ui/activities/ActivitiesControlHeader";

const ProgramsHeader = ({ activeTab, setActiveTab }) => {
  return (
    <ActivitiesControlHeader
      title="Programs"
      options={[
        { label: "Active", value: "active" },
        { label: "Archived", value: "archived" },
      ]}
      value={activeTab}
      onChange={setActiveTab}
    />
  );
};

export default ProgramsHeader;
