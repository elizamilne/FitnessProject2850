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
        className="
          absolute inset-0 w-full h-full object-cover
          transition-transform duration-500 group-hover:scale-105
        "
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

      {/* Content */}
      <div className="relative h-full flex items-center px-5">
        <div>
          <h3
            className="
              text-white font-semibold text-lg tracking-tight
              drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]
            "
          >
            {item.title}
          </h3>

          <p
            className="
              text-sm text-white/80 mt-1
              drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]
            "
          >
            {renderSubtitle?.(item)}
          </p>
        </div>
      </div>

      {/* Subtle glow (on hover) */}
      <div
        className="
          absolute inset-0 rounded-2xl pointer-events-none
          opacity-0 group-hover:opacity-100 transition
          bg-gradient-to-r from-indigo-500/10 to-purple-500/10
        "
      />
    </div>
  );
};

export default ActivityCard;