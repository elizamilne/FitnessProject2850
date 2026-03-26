import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeScreen from "./components/HomeScreen";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Questions from "./components/Questions";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        
        <Route path="/training-page" element={<TrainingPage/>} />
        <Route path="/activities-page" element={<ActivitiesPage/>} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/questions" element={<Questions />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;