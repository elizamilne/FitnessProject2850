import { useEffect, useState } from "react";
import { programService } from "../../../../services/program";

const usePrograms = (profileId) => {
  const [programs, setPrograms] = useState([]);

  const [visibleProgramsMap, setVisibleProgramsMap] = useState({
    active: [],
    archived: [],
  });

  const [activeTab, setActiveTab] = useState("active");
  const [selectedProgram, setSelectedProgram] = useState(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        if (!profileId) return;

        const response =
          activeTab === "active"
            ? await programService.getActive(profileId)
            : await programService.getArchived(profileId);

        const data = response.data;

        setPrograms(data);

        setVisibleProgramsMap((prev) => {
          if (prev[activeTab].length > 0) return prev;

          return {
            ...prev,
            [activeTab]: data.slice(0, 3),
          };
        });

        setSelectedProgram(null);
      } catch (err) {
        console.error("Failed to load programs", err);
      }
    };

    loadPrograms();
  }, [activeTab, profileId]);

  const handleSelectProgram = (program) => {
    setSelectedProgram(program);

    setVisibleProgramsMap((prev) => {
      const current = prev[activeTab];

      const filtered = current.filter((p) => p.id !== program.id);
      const updated = [program, ...filtered].slice(0, 3);

      return {
        ...prev,
        [activeTab]: updated,
      };
    });
  };

  const handleCreateProgram = (newProgram) => {
    setPrograms((prev) => [newProgram, ...prev]);

    setVisibleProgramsMap((prev) => ({
      ...prev,
      [activeTab]: [newProgram, ...(prev[activeTab] || [])].slice(0, 3),
    }));
  };

  return {
    // Data
    programs,
    visibleProgramsMap,
    activeTab,
    selectedProgram,

    // Tab control
    setActiveTab,
    setSelectedProgram,

    // Modal state
    isViewModalOpen,
    isCreateModalOpen,
    isDetailModalOpen,

    // Modal setters
    setIsViewModalOpen,
    setIsCreateModalOpen,
    setIsDetailModalOpen,

    // Actions
    handleSelectProgram,
    handleCreateProgram
  };
};

export default usePrograms;
