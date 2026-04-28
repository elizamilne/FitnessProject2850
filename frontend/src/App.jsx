import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeScreen from "./features/home/HomeScreen";

import TrainingPage from "./features/training/TrainingPage";
import ActivitiesPage from "./features/activities/ActivitiesPage";

import SignUp from "./features/auth/Signup";
import Login from "./features/auth/Login";
import Questions from "./features/auth/Questions"
import PublicLayout from "./common/layout/PublicLayout";


function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route element={<PublicLayout />}>

          <Route path="/" element={<HomeScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

        </Route>

        <Route path="/questions" element={<Questions />} />

        <Route path="/training-page" element={<TrainingPage />} />
        <Route path="/activities-page" element={<ActivitiesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;