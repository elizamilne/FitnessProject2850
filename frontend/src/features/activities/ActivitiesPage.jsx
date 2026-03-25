import ActivitiesPrograms from "./components/ActivitiesPrograms";
import ActivitiesRaces from "./components/ActivitiesRaces";
import ActivitiesHistory from "./components/ActivitiesHistory";

const ActivitiesPage = () => {
    return (
        <div>
            <div className="mb-5 bg-sky-300">.</div>

            <div className="w-[90%] lg:w-4/5 mx-auto  rounded-xl">
                <ActivitiesPrograms></ActivitiesPrograms>
                <div className="mt-12 bt-12"></div>
                <ActivitiesRaces></ActivitiesRaces>
                <div className="mt-12 bt-12"></div>
                <ActivitiesHistory></ActivitiesHistory>
            </div>
        </div>
    )
}

export default ActivitiesPage;
