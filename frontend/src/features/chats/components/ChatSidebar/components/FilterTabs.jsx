const FilterTabs = ({ value, onChange }) => {
  const tabs = [
    { key: "all", label: "All" },
    { key: "group", label: "Groups" },
    { key: "chat", label: "Chats" },
  ];

  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex-1 rounded py-1 transition ${
            value === tab.key
              ? "bg-indigo-300"
              : "bg-indigo-100 hover:bg-indigo-200"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;