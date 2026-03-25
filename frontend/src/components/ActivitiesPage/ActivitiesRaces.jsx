import { Plus } from "lucide-react";
import { useState } from "react";

const ActivitiesRaces = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-6">
      {/* Header */}
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
            onClick={() => setActiveTab("past")}
            className={`relative px-4 py-2 text-sm z-10 text-center ${
              activeTab === "past" ? "text-black" : "text-gray-500"
            }`}
          >
            Past
          </button>
        </div>
      </div>

      {/* Race Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Race 1 */}
        <div className="relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition h-32">
          <img
            src="https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf"
            alt="London Marathon"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />

          <div className="relative h-full flex items-center px-4">
            <div className="text-white">
              <h3 className="font-semibold text-lg">London Marathon</h3>
              <p className="text-sm text-white/80">21 Apr · 42.2km</p>
            </div>
          </div>
        </div>

        {/* Race 2 */}
        <div className="relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition h-32">
          <img
            src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211"
            alt="City 10K"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />

          <div className="relative h-full flex items-center px-4">
            <div className="text-white">
              <h3 className="font-semibold text-lg">City 10K</h3>
              <p className="text-sm text-white/80">12 May · 10km</p>
            </div>
          </div>
        </div>

        {/* Race 3 */}
        <div className="relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition h-32">
          <img
            src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5"
            alt="Trail Half Marathon"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />

          <div className="relative h-full flex items-center px-4">
            <div className="text-white">
              <h3 className="font-semibold text-lg">Trail Half Marathon</h3>
              <p className="text-sm text-white/80">2 Jun · 21.1km</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <button className="w-9 h-9 shrink-0 flex items-center justify-center border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition">
          <Plus size={18} />
        </button>

        <button className="group relative inline-flex items-center gap-1 text-sm text-blue-600">
          View All
          <span className="transition-transform duration-200 group-hover:translate-x-[2px]">
            →
          </span>
          <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-blue-600 transition-all duration-300 group-hover:w-full" />
        </button>
      </div>
    </div>
  );
};

export default ActivitiesRaces;