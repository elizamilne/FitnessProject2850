import Modal from "../../../../common/ui/Modal";

const DetailRaceModal = ({
  isOpen,
  onClose,
  race,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header={<h3 className="text-lg font-semibold">View Race</h3>}
      body={
        race ? (
          <div className="space-y-3">
            <img
              src={
                race.bannerUrl ||
                "https://via.placeholder.com/300x200"
              }
              alt={race.title}
              className="w-full h-40 object-cover rounded-lg"
            />

            <h4 className="text-lg font-semibold">{race.title}</h4>

            <p className="text-sm text-gray-500">
              {new Date(race.date).toLocaleDateString()} • {race.location}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No race selected</p>
        )
      }
    />
  );
};

export default DetailRaceModal;