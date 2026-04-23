import Modal from "../../../../common/ui/Modal";

const ViewAllRaceModal = ({
  isOpen,
  onClose,
  races = [],
  onSelect,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header={<h3 className="text-lg font-semibold">Select Race</h3>}
      body={
        <div className="space-y-2">
          {races.length === 0 ? (
            <p className="text-sm text-gray-500">No races found</p>
          ) : (
            races.map((race) => (
              <div
                key={race.id}
                onClick={() => {
                  onSelect(race);
                  onClose();
                }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition"
              >
                <img
                  src={race.bannerUrl || "https://via.placeholder.com/60"}
                  alt={race.title}
                  className="w-12 h-12 rounded-md object-cover"
                />

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{race.title}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {new Date(race.date).toLocaleDateString()} • {race.location}
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

export default ViewAllRaceModal;