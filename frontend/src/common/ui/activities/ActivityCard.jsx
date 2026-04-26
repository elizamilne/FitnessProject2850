const ActivityCard = ({
  item,
  onClick,
  placeholderText = "Item",
  renderSubtitle,
}) => {
  return (
    <div
      onClick={() => onClick?.(item)}
      className="
        group relative h-32 rounded-2xl overflow-hidden cursor-pointer
        transition-all duration-300
      "
    >
      {/* Image */}
      <img
        src={
          item.bannerUrl ||
          `https://via.placeholder.com/300x200?text=${placeholderText}`
        }
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover
                   transition-transform duration-500 group-hover:scale-105"
      />

      {/* Light overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/30 to-transparent" />

      {/* Content */}
      <div className="relative h-full flex items-center px-5">
        <div>
          <h3 className="text-gray-900 font-semibold text-lg tracking-tight">
            {item.title}
          </h3>

          <p className="text-sm text-gray-600 mt-1">
            {renderSubtitle?.(item)}
          </p>
        </div>
      </div>

      {/* Subtle glow (on hover) */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none
                   opacity-0 group-hover:opacity-100 transition
                   bg-gradient-to-r from-indigo-500/10 to-purple-500/10"
      />
    </div>
  );
};

export default ActivityCard;