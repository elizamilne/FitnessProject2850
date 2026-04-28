import Modal from "../Modal";

const ActivitiesViewAllModal = ({
  isOpen,
  onClose,
  items = [],
  title = "Select Item",
  emptyText = "No items found",
  onSelect,
  renderSubtitle,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header={<h3 className="text-lg font-semibold">{title}</h3>}
      body={
        <div className="space-y-2">
          {!items.length ? (
            <p className="text-sm text-gray-500">{emptyText}</p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition"
              >
                <img
                  src={item.bannerUrl || "https://via.placeholder.com/60"}
                  alt={item.title}
                  className="w-12 h-12 rounded-md object-cover"
                />

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.title}</p>

                  <p className="text-xs text-gray-500 truncate">
                    {renderSubtitle?.(item)}
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

export default ActivitiesViewAllModal;