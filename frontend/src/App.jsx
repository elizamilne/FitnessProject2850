import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeScreen from "./features/home/HomeScreen";
import Login from "./features/auth/Login";
import SignUp from "./components/Signup";
import Questions from "./components/Questions";

import TrainingPage from "./features/training/TrainingPage";
import ActivitiesPage from "./features/activities/ActivitiesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        
        <Route path="/training-page" element={<TrainingPage/>} />
        <Route path="/activities-page" element={<ActivitiesPage/>} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/questions" element={<Questions />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;