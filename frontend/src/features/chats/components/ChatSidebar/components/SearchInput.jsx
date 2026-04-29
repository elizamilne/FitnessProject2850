const SearchInput = ({
  label = "Search",
  placeholder = "Search...",
  value,
  onChange,
  onClear
}) => {

  const handleOnChange = (e) => {
    const value = e.target.value;
    onChange(value);

    if (!value.trim()) {
      onClear?.();
    }
  };

  return (
    <div className="space-y-2">
      
      {/* Label */}
      <h3 className="text-sm font-medium text-gray-600">
        {label}
      </h3>

      {/* Input wrapper */}
      <div
        className="
          flex items-center px-3 py-2 rounded-xl
          bg-white/70 backdrop-blur
          border border-white/50
          shadow-[0_4px_15px_rgba(0,0,0,0.05)]
          transition
          focus-within:ring-2 focus-within:ring-indigo-400/40
        "
      >
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleOnChange}
          className="
            w-full bg-transparent
            text-gray-800 placeholder-gray-400
            focus:outline-none
          "
        />

        {/* Optional clear button */}
        {value && (
          <button
            onClick={() => {
              onChange("");
              onClear?.();
            }}
            className="
              ml-2 text-gray-400 hover:text-gray-600
              transition text-sm
            "
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchInput;