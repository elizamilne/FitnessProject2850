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
      header={<h3 className="text-xl font-semibold text-gray-900">{title}</h3>}
      body={
        <div className="space-y-2">
          {!items.length ? (
            <div className="text-center py-10 text-md text-gray-500">
              {emptyText}
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
                className="
                  group flex items-center gap-4 px-4 py-3 rounded-xl
                  cursor-pointer transition-all duration-200

                  bg-white/60 backdrop-blur-md border border-white/50

                  hover:bg-gradient-to-r 
                  hover:from-indigo-500/5 hover:to-purple-500/5
                  hover:border-indigo-200/60
                "
              >
                {/* Image */}
                <img
                  src={item.bannerUrl || "https://via.placeholder.com/60"}
                  alt={item.title}
                  className="w-14 h-14 rounded-lg object-cover"
                />

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {item.title}
                  </p>

                  <p className="text-sm text-gray-500 truncate">
                    {renderSubtitle?.(item)}
                  </p>
                </div>

                {/* Arrow */}
                <span
                  className="
                    text-gray-400 text-sm
                    transition-all duration-200
                    group-hover:text-indigo-500
                    group-hover:translate-x-1
                  "
                >
                  →
                </span>
              </div>
            ))
          )}
        </div>
      }
    />
  );
};

export default ActivitiesViewAllModal;
