import { Plus } from "lucide-react";

const ActivitiesControlFooter = ({
  onCreate,
  onViewAll,
  viewAllLabel = "View All",
}) => {
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onCreate}
        className="w-9 h-9 shrink-0 flex items-center justify-center border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition"
      >
        <Plus size={18} />
      </button>

      <button
        onClick={onViewAll}
        className="group relative inline-flex items-center gap-1 text-sm text-blue-600"
      >
        {viewAllLabel}
        <span className="transition-transform duration-200 group-hover:translate-x-[2px]">
          →
        </span>
        <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-blue-600 transition-all duration-300 group-hover:w-full" />
      </button>
    </div>
  );
};

export default ActivitiesControlFooter;