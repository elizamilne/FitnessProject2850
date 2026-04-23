import { Plus } from "lucide-react";
import { programService } from "../../../services/program";
import { useEffect, useState } from "react";

const ActivitiesPrograms = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [programs, setPrograms] = useState([]);
  const dayOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const sortDays = (days = []) => {
    return [...days].sort(
      (a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b)
    );
  }; 

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const profileId = 1;

        let response;

        if (activeTab === "active") {
          response = await programService.getActive(profileId);
        } else {
          response = await programService.getArchived(profileId);
        }

        setPrograms(response.data);
      } catch (err) {
        console.error("Failed to load programs", err);
      }
    };

    loadPrograms();
  }, [activeTab]);

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Programs</h2>

        <div className="relative grid grid-cols-2 bg-gray-100 p-1 rounded-full w-fit">
          {/* Sliding background */}
          <div
            className={`absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] bg-white rounded-full shadow transition-transform duration-300
            ${activeTab === "active" ? "translate-x-0" : "translate-x-full"}
            `}
          />

          <button
            onClick={() => setActiveTab("active")}
            className={`relative px-4 py-2 text-sm z-10 text-center ${
              activeTab === "active" ? "text-black" : "text-gray-500"
            }`}
          >
            Active
          </button>

          <button
            onClick={() => setActiveTab("archived")}
            className={`relative px-4 py-2 text-sm z-10 text-center ${
              activeTab === "archived" ? "text-black" : "text-gray-500"
            }`}
          >
            Archived
          </button>
        </div>
      </div>

      {/* Program Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {programs.length === 0 ? (
          <p className="text-gray-500 text-sm">No programs found</p>
        ) : (
          programs.slice(0, 3).map((program) => (
            <div
              key={program.id}
              className="relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition h-32"
            >
              <img
                src={
                  program.bannerUrl ||
                  "https://via.placeholder.com/300x200?text=Program"
                }
                alt={program.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />

              <div className="relative h-full flex items-center px-4">
                <div className="text-white">
                  <h3 className="font-semibold text-lg">{program.title}</h3>

                  <p className="text-sm text-white/80">
                    {sortDays(program.weeklyFrequency).join(", ") || "No schedule"}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
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

export default ActivitiesPrograms;
