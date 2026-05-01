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

  const handleUpdateProgram = (updatedProgram) => {
    if (updatedProgram.deleted) {
      setPrograms((prev) =>
        prev.filter((program) => program.id !== updatedProgram.id)
      );

      setVisibleProgramsMap((prev) => ({
        active: prev.active.filter((program) => program.id !== updatedProgram.id),
        archived: prev.archived.filter(
          (program) => program.id !== updatedProgram.id
        ),
      }));

      setSelectedProgram(null);
      setIsDetailModalOpen(false);
      return;
    }

    setPrograms((prev) => {
      const exists = prev.some((program) => program.id === updatedProgram.id);

      if (!exists) return prev;

      return prev.map((program) =>
        program.id === updatedProgram.id ? updatedProgram : program
      );
    });

    setVisibleProgramsMap((prev) => {
      const removeFromActive = prev.active.filter(
        (program) => program.id !== updatedProgram.id
      );

      const removeFromArchived = prev.archived.filter(
        (program) => program.id !== updatedProgram.id
      );

      if (updatedProgram.archived) {
        return {
          active: removeFromActive,
          archived: [updatedProgram, ...removeFromArchived].slice(0, 3),
        };
      }

      return {
        active: [updatedProgram, ...removeFromActive].slice(0, 3),
        archived: removeFromArchived,
      };
    });

    setSelectedProgram(updatedProgram);
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
    handleCreateProgram,
    handleUpdateProgram
  };
};

export default usePrograms;
