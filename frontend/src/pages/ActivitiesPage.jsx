import ActivitiesPrograms from "../components/ActivitiesPage/ActivitiesPrograms";
import ActivitiesRaces from "../components/ActivitiesPage/ActivitiesRaces";

const ActivitiesPage = () => {
    return (
        <div>
            <div className="mb-5 bg-sky-300">.</div>

            <div className="w-[90%] lg:w-4/5 mx-auto  rounded-xl">
                <ActivitiesPrograms></ActivitiesPrograms>
                <div className="mt-12 bt-12"></div>
                <ActivitiesRaces></ActivitiesRaces>
            </div>
        </div>
    )
}

export default ActivitiesPage;
