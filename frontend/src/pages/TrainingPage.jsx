import TrainingCalendar from "../components/TrainingPage/TrainingCalendar";
import TrainingContentList from "../components/TrainingPage/TrainingContentList";

const TrainingPage = () =>  {
    return (
        <div>
            <div className="mb-5 bg-sky-300">.</div>

            <div className="w-4/5 mx-auto bg-yellow-300 p-5 rounded-xl">
                <TrainingCalendar></TrainingCalendar>
                <TrainingContentList></TrainingContentList>
            </div>
        </div>
    )
}

export default TrainingPage;
