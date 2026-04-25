import Modal from "../../../../common/ui/Modal";
import { sortDays } from "../utils/formatters";

const ViewAllProgramModal = ({
  isOpen,
  onClose,
  programs = [],
  onSelect,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header={<h3 className="text-lg font-semibold">Select Program</h3>}
      body={
        <div className="space-y-2">
          {programs.length === 0 ? (
            <p className="text-sm text-gray-500">No programs found</p>
          ) : (
            programs.map((program) => (
              <div
                key={program.id}
                onClick={() => {
                  onSelect(program);
                  onClose();
                }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition"
              >
                <img
                  src={program.bannerUrl || "https://via.placeholder.com/60"}
                  alt={program.title}
                  className="w-12 h-12 rounded-md object-cover"
                />

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{program.title}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {sortDays(program.weeklyFrequency).join(", ") ||
                      "No schedule"}
                  </p>
                </div>

                <span className="text-xs text-gray-400">→</span>
              </div>
            ))
          )}
        </div>
      }
    />
  );
};

export default ViewAllProgramModal;
