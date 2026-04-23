const ProgramsHeader = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold">Programs</h2>

      <div className="relative grid grid-cols-2 bg-gray-100 p-1 rounded-full w-fit">
        <div
          className={`absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] bg-white rounded-full shadow transition-transform duration-300
          ${activeTab === "active" ? "translate-x-0" : "translate-x-full"}`}
        />

        <button
          onClick={() => onTabChange("active")}
          className={`relative px-4 py-2 text-sm z-10 text-center ${
            activeTab === "active" ? "text-black" : "text-gray-500"
          }`}
        >
          Active
        </button>

        <button
          onClick={() => onTabChange("archived")}
          className={`relative px-4 py-2 text-sm z-10 text-center ${
            activeTab === "archived" ? "text-black" : "text-gray-500"
          }`}
        >
          Archived
        </button>
      </div>
    </div>
  );
};

export default ProgramsHeader;