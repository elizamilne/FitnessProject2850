const ActivitiesControlGrid = ({
  items,
  onSelect,
  emptyText = "No items found",
  placeholderText = "Item",
  renderSubtitle,
}) => {
  if (!items.length) {
    return <p className="text-gray-500 text-sm">{emptyText}</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition h-32 cursor-pointer"
          onClick={() => onSelect(item)}
        >
          <img
            src={
              item.bannerUrl ||
              `https://via.placeholder.com/300x200?text=${placeholderText}`
            }
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />

          <div className="relative h-full flex items-center px-4">
            <div className="text-white">
              <h3 className="font-semibold text-lg">{item.title}</h3>

              <p className="text-sm text-white/80">
                {renderSubtitle ? renderSubtitle(item) : null}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivitiesControlGrid;