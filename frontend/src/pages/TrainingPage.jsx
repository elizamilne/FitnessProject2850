import TrainingCalendar from "../components/TrainingPage/TrainingCalendar";
import TrainingContentList from "../components/TrainingPage/TrainingContentList";
import TrainingOverviewRow from "../components/TrainingPage/TrainingOverviewRow";
import TrainingProgramSelector from "../components/TrainingPage/TrainingProgramSelector";
import TrainingStatistics from "../components/TrainingPage/TrainingStatistics";

const TrainingPage = () => {
  return (
    <div>
      <div className="mb-5 bg-sky-300">.</div>

      <div className="w-[90%] lg:w-4/5 mx-auto  rounded-xl ">
        <TrainingCalendar></TrainingCalendar>

        <div className="mt-12 mb-12 text-center">
          <h1 className="text-2xl font-semibold">Today's Plan</h1>
        </div>
        
        <TrainingProgramSelector></TrainingProgramSelector>
        <TrainingContentList></TrainingContentList>

        <div className="mt-12 bt-12"></div>

        <TrainingStatistics></TrainingStatistics>

        <div className="mt-12 bt-12"></div>

        <TrainingOverviewRow></TrainingOverviewRow>

        <div className="mt-12 bt-12"></div>

      </div>
    </div>
  );
};

export default TrainingPage;
