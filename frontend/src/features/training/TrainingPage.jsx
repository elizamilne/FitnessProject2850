import TrainingCalendar from "./components/TrainingCalendar";
import TrainingContentList from "./components/TrainingContentList";
import TrainingOverviewRow from "./components/TrainingOverviewRow";
import TrainingStatistics from "./components/TrainingStatistics";
import TrainingProgramSelector from "./components/TrainingProgramSelector";
import { programService } from "../../services/program";
import { useEffect, useState } from "react";
import AppNavbar from "../../common/layout/PrimaryNavbar";

const TrainingPage = () => {
  const [programs, setPrograms] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);

  // Updates the currently selected date
  const handleDateChange = (date) => {
    console.log("Selected date:", date);
    setSelectedDate(date);
    setSelectedProgram(null);
    setPrograms([]);
  };

  // Updates the currently selected program
  const handleProgramChange = (program) => {
    console.log("Selected program:", program);
    setSelectedProgram(program);
  };

  // Loads programs when selectedDate changes
  useEffect(() => {
    if (!selectedDate) return; 

    const loadPrograms = async () => {
      try {
        const profileId = 1;
        const { data } = await programService.getByProfileAndDate(
          profileId,
          selectedDate,
        );

        console.log("Loaded programs:", data);
        setPrograms(data);
      } catch (error) {
        console.error("Failed:", error.response?.data);
      }
    };

    loadPrograms();
  }, [selectedDate]);

  return (
    <div>

      <AppNavbar/>

      <div className="w-[90%] lg:w-4/5 mx-auto  rounded-xl ">
        <TrainingCalendar
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />

        <div className="mt-12 mb-12 text-center">
          <h1 className="text-2xl font-semibold">Today's Plan</h1>
        </div>

        <TrainingProgramSelector
          programs={programs}
          selectedProgram={selectedProgram}
          onProgramChange={handleProgramChange}
        />

        <TrainingContentList 
          program={selectedProgram}
          date={selectedDate}
        />
        
        <div className="mt-12 bt-12"></div>

        <TrainingStatistics/>

        <div className="mt-12 bt-12"></div>

        <TrainingOverviewRow/>

        <div className="mt-12 bt-12"></div>
      </div>
    </div>
  );
};

export default TrainingPage;
