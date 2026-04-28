import { useEffect, useState } from "react";
import { categoryService } from "../../../../../../services/category";

const ExerciseCategorySelect = ({ onSelect, onNext, selectedCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await categoryService.getAll();
      setCategories(response.data);
    };

    fetchCategories();
  }, []);

  const handleClick = (category) => {
    onSelect?.(category);
    onNext?.();
  };

  return (
    <div className="space-y-3">
      {/* HEADER */}
      <h3 className="text-xl font-semibold text-gray-900">Select Category</h3>

      {/* LIST */}
      <div className="space-y-2">
        {categories.map((c) => {
          const isSelected = selectedCategory?.id === c.id;

          return (
            <div
              key={c.id}
              onClick={() => handleClick(c)}
              className={`
            group flex items-center gap-4 px-4 py-3 rounded-xl
            cursor-pointer transition-all duration-200

            bg-white/60 backdrop-blur-md border border-white/50

            ${
              isSelected
                ? `
                  bg-gradient-to-r from-indigo-500/10 to-purple-500/10
                  border-indigo-200
                `
                : `
                  hover:bg-gradient-to-r 
                  hover:from-indigo-500/5 hover:to-purple-500/5
                  hover:border-indigo-200/60
                `
            }
          `}
            >
              {/* IMAGE */}
              <img
                src={c.image || "https://via.placeholder.com/60"}
                alt={c.name}
                className="w-14 h-14 rounded-lg object-cover"
              />

              {/* TEXT */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{c.name}</p>

                <p className="text-sm text-gray-500 truncate">
                  {c.description || "Category"}
                </p>
              </div>

              {/* ARROW */}
              <span
                className={`
              text-sm transition-all duration-200
              ${
                isSelected
                  ? "text-indigo-600"
                  : "text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-1"
              }
            `}
              >
                →
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExerciseCategorySelect;
