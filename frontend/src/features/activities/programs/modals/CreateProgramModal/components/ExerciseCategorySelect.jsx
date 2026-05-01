import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

const ExerciseCategorySelect = ({
  categories = [],
  loading = false,
  onSelect,
  animate = true,
}) => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    if (!categories.length || !animate) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".category-item",
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.2,
          stagger: 0.02,
          ease: "power2.out",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [categories, animate]);

  const handleClick = (category) => {
    onSelect?.(category);
  };

  const isEmpty = !loading && categories.length === 0;

  return (
    <div ref={containerRef} className="space-y-3">
      <h3 className="text-xl font-semibold text-gray-900">
        Select Category
      </h3>

      {loading ? (
        <div className="text-center py-10 text-md text-gray-500">
          Loading categories...
        </div>
      ) : isEmpty ? (
        <div className="text-center py-10 text-md text-gray-500">
          No categories found
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map((c) => (
            <div
              key={c.id}
              onClick={() => handleClick(c)}
              className="
                category-item
                group flex items-center gap-4 px-4 py-3 rounded-xl
                cursor-pointer transition-all duration-200
                bg-white/60 backdrop-blur-md border border-white/50
                hover:bg-gradient-to-r 
                hover:from-indigo-500/5 hover:to-purple-500/5
                hover:border-indigo-200/60
              "
              style={{
                opacity: animate ? 0 : 1,
                transform: animate ? "translateY(16px)" : "translateY(0px)",
              }}
            >
              <img
                src={c.image || "https://via.placeholder.com/60"}
                alt={c.name}
                className="w-14 h-14 rounded-lg object-cover"
              />

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {c.name}
                </p>

                <p className="text-sm text-gray-500 truncate">
                  {c.description || "Category"}
                </p>
              </div>

              <span
                className="
                  text-sm transition-all duration-200
                  text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-1
                "
              >
                →
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExerciseCategorySelect;