const RacesGrid = ({
  races,
  visisbleRacesMap,
  activeTab,
  setSelectedRace,
  setIsDetailModalOpen,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {races.length === 0 ? (
        <p className="text-gray-500 text-sm">No races found</p>
      ) : (
        visisbleRacesMap[activeTab].map((race) => (
          <div
            key={race.id}
            className="relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition h-32"
            onClick={() => {
              setSelectedRace(race);
              setIsDetailModalOpen(true);
            }}
          >
            <img
              src={
                race.bannerUrl ||
                "https://via.placeholder.com/300x200?text=Race"
              }
              alt={race.title}
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />

            <div className="relative h-full flex items-center px-4">
              <div className="text-white">
                <h3 className="font-semibold text-lg">{race.title}</h3>

                <p className="text-sm text-white/80">
                  {new Date(race.date).toLocaleDateString()} *{" "}
                  {race.location}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RacesGrid;