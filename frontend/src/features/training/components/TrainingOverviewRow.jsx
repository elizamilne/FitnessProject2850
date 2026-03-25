const TrainingOverviewRow = () => {
  return (
    <div className="w-[90%] mx-auto">
      {/* Section Title */}
      <h2 className="text-xl font-semibold mb-4">Overview</h2>

      {/* Row */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Left */}
        <div className="bg-white p-5 rounded-2xl shadow-sm flex-1 flex flex-col items-center justify-center text-center">
          <h4 className="text-sm text-gray-500">Next Race</h4>
          <p className="text-lg font-semibold mt-1">16th May</p>
        </div>

        {/* Right */}
        <div className="bg-white p-5 rounded-2xl shadow-sm flex-1">
          <h4 className="text-sm text-gray-500 mb-2">Personal Records</h4>

          <ul className="space-y-1 text-sm text-gray-700">
            <li>5km - 30m</li>
            <li>10km - 1h 10m</li>
            <li>Half Marathon - 2h 30m</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TrainingOverviewRow;
