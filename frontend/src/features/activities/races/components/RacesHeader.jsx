const RacesHeader = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold">Races</h2>

      {/* Tabs */}
      <div className="relative grid grid-cols-2 bg-gray-100 p-1 rounded-full w-fit">
        {/* Sliding background */}
        <div
          className={`absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] bg-white rounded-full shadow transition-transform duration-300
          ${activeTab === "upcoming" ? "translate-x-0" : "translate-x-full"}
          `}
        />

        <button
          onClick={() => setActiveTab("upcoming")}
          className={`relative px-4 py-2 text-sm z-10 text-center ${
            activeTab === "upcoming" ? "text-black" : "text-gray-500"
          }`}
        >
          Upcoming
        </button>

        <button
          onClick={() => setActiveTab("completed")}
          className={`relative px-4 py-2 text-sm z-10 text-center ${
            activeTab === "completed" ? "text-black" : "text-gray-500"
          }`}
        >
          Completed
        </button>
      </div>
    </div>
  );
};

export default RacesHeader;