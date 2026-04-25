import AppNavbar from "../../common/layout/PrimaryNavbar";
import ActivitiesHistory from "./components/ActivitiesHistory";
import ActivitiesPrograms from "./programs";
import ActivitiesRaces from "./races";

const ActivitiesPage = () => {
    return (
        <div>
            <AppNavbar/>

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
