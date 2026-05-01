const ProgramHero = ({ title, bannerUrl, archived }) => {
  return (
    <div className="relative">
      <img
        src={bannerUrl || "https://via.placeholder.com/300x200"}
        alt={title}
        className="w-full h-48 object-cover rounded-2xl"
      />

      <div className="absolute inset-0 rounded-2xl bg-black/20" />

      <span
        className={`
          absolute top-3 right-3 rounded-full px-3 py-1
          text-xs font-semibold backdrop-blur-md
          ${
            archived
              ? "bg-gradient-to-r from-red-500 to-red-500 text-white shadow-md"
              : "bg-gradient-to-r from-green-500 to-emerald-500 shadow-md text-white"
          }
        `}
      >
        {archived ? "Archived" : "Active"}
      </span>
    </div>
  );
};

export default ProgramHero;