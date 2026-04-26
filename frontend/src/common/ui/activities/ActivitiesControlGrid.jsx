import ActivityCard from "./ActivityCard";

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
