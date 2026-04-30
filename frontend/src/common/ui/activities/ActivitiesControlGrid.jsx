import ActivityCard from "./ActivityCard";

const ActivitiesControlGrid = ({
  items,
  onSelect,
  emptyText = "No items found",
  placeholderText = "Item",
  renderSubtitle,
}) => {
  // Empty state
  if (!items.length) {
    return (
      <div className="w-full flex items-center justify-center py-4">
        <div className="text-center text-gray-400 max-w-sm space-y-2">
          <p className="text-base font-semibold text-gray-500">
             {emptyText}
          </p>
          <p className="text-sm leading-relaxed">
            Try adjusting your filters or adding new items
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((item) => (
        <ActivityCard
          key={item.id}
          item={item}
          onClick={onSelect}
          placeholderText={placeholderText}
          renderSubtitle={renderSubtitle}
        />
      ))}
    </div>
  );
};

export default ActivitiesControlGrid;