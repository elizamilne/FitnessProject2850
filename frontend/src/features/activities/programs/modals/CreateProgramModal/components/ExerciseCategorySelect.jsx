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
    <div>
      <h3>Exercise Category Select</h3>

      <div className="space-y-2">
        {categories.map((c) => (
          <div
            key={c.id}
            onClick={() => handleClick(c)}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition hover:bg-gray-100 ${
              selectedCategory?.id === c.id ? "bg-gray-100" : ""
            }`}
          >
            <img
              src={c.img || "https://via.placeholder.com/60"}
              alt={c.name}
              className="w-12 h-12 rounded-md object-cover"
            />

            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{c.name}</p>
              {/* optional subtitle */}
              <p className="text-xs text-gray-500 truncate">
                {c.description || "Category"}
              </p>
            </div>

            <span className="text-xs text-gray-400">→</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseCategorySelect;
