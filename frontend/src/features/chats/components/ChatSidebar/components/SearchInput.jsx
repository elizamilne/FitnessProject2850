const SearchInput = ({
  label = "Search",
  placeholder = "Search...",
  value,
  onChange,
  onClear
}) => {

  // Search logic on change
  const handleOnChange = (e) => {
    const value = e.target.value;
    onChange(value);

    // Clear results immediately when empty
    if (!value.trim()) {
      onClear?.();
    }
  };
  return (
    <div>
      <h3 className="font-semibold mb-2">{label}</h3>

      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleOnChange}
        className="
          w-full 
          border border-gray-300 
          rounded px-3 py-2 
          focus:outline-none 
          focus:ring-2 focus:ring-orange-400
          transition
        "
      />
    </div>
  );
};

export default SearchInput;
