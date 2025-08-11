import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Settings from "./pages/Settings";
import Stats from "./pages/Stats";
import Timer from "./pages/Timer";
import "./styles.css";

export default function App() {
  return (
    <div className="wrapper">
      <NavBar />
      <Routes>
        <Route path="/" element={<Timer />} />
        <Route path="/timer" element={<Timer />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}
