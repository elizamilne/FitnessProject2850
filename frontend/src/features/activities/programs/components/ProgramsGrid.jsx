import { sortDays } from "../utils/formatters";

const ProgramsGrid = ({ programs, onSelect }) => {
  if (!programs.length) {
    return <p className="text-gray-500 text-sm">No programs found</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {programs.map((program) => (
        <div
          key={program.id}
          className="relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition h-32"
          onClick={() => onSelect(program)}
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
                {sortDays(program.weeklyFrequency).join(", ") ||
                  "No schedule"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgramsGrid;