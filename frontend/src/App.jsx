import "./App.css";

import { Routes, Route } from "react-router-dom";

import AboutUs from "./pages/AboutUs";
import Home from "./pages/home";

function App() {
  return (
    <div>
      {/* Basic navigation */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
      </Routes>
    </div>
  );
}

export default App;
