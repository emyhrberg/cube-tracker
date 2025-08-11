import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import LogIn from "./pages/LogIn";
import Stats from "./pages/Stats";
import Timer from "./pages/Timer";
import "./styles.css";

export default function App() {
  return (
    <>
      <div className="wrapper">
        <NavBar />
      </div>
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Timer />} />
          <Route path="/timer" element={<Timer />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/login" element={<LogIn />} />
        </Routes>
      </div>
    </>
  );
}
