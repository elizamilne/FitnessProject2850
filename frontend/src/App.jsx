/*import "./App.css";

import { Routes, Route } from "react-router-dom";

import AboutUs from "./pages/AboutUs";
import Home from "./pages/home";
import Login from "./components/Login";


function App() {
  return (
    <div>
      { Basic navigation }
      /*<Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
/* 
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; */
// App.js
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeScreen from "./components/HomeScreen";
import Login from "./components/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<HomeScreen />} />

       
        <Route path="/login" element={<Login />} />

        
      </Routes>
    </BrowserRouter>
  );
}

export default App;