import TrainingCalendar from "../components/TrainingPage/TrainingCalendar";
import TrainingContentList from "../components/TrainingPage/TrainingContentList";
import TrainingProgramSelector from "../components/TrainingPage/TrainingProgramSelector";

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
      </div>
    </div>
  );
};

export default TrainingPage;
