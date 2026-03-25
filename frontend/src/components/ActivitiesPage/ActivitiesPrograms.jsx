import { Plus } from "lucide-react";
import { useState } from "react";

const ActivitiesPrograms = () => {
  const [activeTab, setActiveTab] = useState("active");

  return (
    <div class="bg-white rounded-2xl shadow p-6 space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold">Programs</h2>

        <div className="relative grid grid-cols-2 bg-gray-100 p-1 rounded-full w-fit">
          {/* Sliding background */}
          <div
            className={`absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] bg-white rounded-full shadow transition-transform duration-300
            ${activeTab === "active" ? "translate-x-0" : "translate-x-full"}
            `}
          />

          {/* Buttons */}
          <button
            onClick={() => setActiveTab("active")}
            className="relative px-4 py-2 text-sm z-10 text-center"
          >
            Active
          </button>

          <button
            onClick={() => setActiveTab("archived")}
            className="relative px-4 py-2 text-sm z-10 text-center"
          >
            Archived
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition h-32">
          {/* Background Image */}
          <img
            src="https://media.istockphoto.com/id/2075354173/photo/fitness-couple-is-doing-kettlebell-twist-in-a-gym-togehter.jpg?s=612x612&w=0&k=20&c=lfs1V1d0YB33tn72myi6FElJnylPJYYM9lW5ZhlnYqY="
            alt="Program image"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Overlay (dark gradient for readability) */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />

          {/* Content */}
          <div className="relative h-full flex items-center px-4">
            <div className="text-white">
              <h3 className="font-semibold text-lg">Program 1</h3>
              <p className="text-sm text-white/80">Description here</p>
            </div>
          </div>
        </div>

        {/* Program 2 */}
        <div className="relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition h-32">
          <img
            src="https://images5.alphacoders.com/652/652255.jpg"
            alt="Program 2"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />

          <div className="relative h-full flex items-center px-4">
            <div className="text-white">
              <h3 className="font-semibold text-lg">Program 2</h3>
              <p className="text-sm text-white/80">Description here</p>
            </div>
          </div>
        </div>

        {/* Program 3 */}
        <div className="relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition h-32">
          <img
            src="https://images.unsplash.com/photo-1599058917212-d750089bc07e"
            alt="Program 3"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />

          <div className="relative h-full flex items-center px-4">
            <div className="text-white">
              <h3 className="font-semibold text-lg">Program 3</h3>
              <p className="text-sm text-white/80">Description here</p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <button className="w-9 h-9 shrink-0 flex items-center justify-center border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition">
          <Plus size={18} />
        </button>

        <button className="group relative inline-flex items-center gap-1 text-sm text-blue-600">
          View All
          <span className="transition-transform duration-200 group-hover:translate-x-[2px]">
            →
          </span>
          {/* Underline */}
          <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-blue-600 transition-all duration-300 group-hover:w-full" />
        </button>
      </div>
    </div>
  );
};

export default ActivitiesPrograms;
