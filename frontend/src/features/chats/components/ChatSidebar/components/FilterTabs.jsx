import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";

const tabs = [
  { key: "all", label: "All" },
  { key: "group", label: "Groups" },
  { key: "chat", label: "Chats" },
];

const FilterTabs = ({ value, onChange }) => {
  const indicatorRef = useRef(null);
  const tabRefs = useRef([]);

  const updateIndicator = useCallback(() => {
    const index = tabs.findIndex((t) => t.key === value);
    const el = tabRefs.current[index];
    const indicator = indicatorRef.current;

    if (!el || !indicator) return;

    gsap.to(indicator, {
      x: el.offsetLeft,
      width: el.offsetWidth,
      duration: 0.35,
      ease: "power3.out",
    });
  }, [value]);

  // Run on value change
  useEffect(() => {
    updateIndicator();
  }, [updateIndicator]);

  // Run on resize
  useEffect(() => {
    const handleResize = () => updateIndicator();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateIndicator]);

  return (
    <div
      className="
        relative flex p-1 rounded-xl
        bg-white/60 backdrop-blur
        border border-white/50
      "
    >
      {/* Indicator */}
      <div
        ref={indicatorRef}
        className="
          absolute top-1 bottom-1 left-0
          rounded-lg
          bg-gradient-to-r from-indigo-500 to-purple-500
          shadow-[0_4px_15px_rgba(99,102,241,0.25)]
        "
      />

      {/* Tabs */}
      {tabs.map((tab, i) => {
        const isActive = value === tab.key;

        return (
          <button
            key={tab.key}
            ref={(el) => (tabRefs.current[i] = el)}
            onClick={() => onChange(tab.key)}
            className={`
              relative flex-1 py-1.5 text-sm font-medium
              transition-colors duration-200 z-10
              ${isActive ? "text-white" : "text-gray-600"}
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default FilterTabs;