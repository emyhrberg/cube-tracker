import { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/erky-logo.webp";
import SettingsModal from "./SettingsModal";

export default function NavBar() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <nav className="top-nav" style={{ display: "flex", alignItems: "center" }}>
        <a
          href="https://github.com/emyhrberg"
          target="_blank"
          rel="noopener noreferrer"
          title="https://github.com/emyhrberg"
        >
          <img className="logo" src={logo} alt="logo" width="50" height="50" />
        </a>
        <NavLink to="/timer" end>
          Timer
        </NavLink>
        <NavLink to="/stats">Stats</NavLink>
        <NavLink to="/login">Log In</NavLink>

        {/* Settings Icon */}
        <button
          onClick={() => setSettingsOpen(true)}
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            fontSize: "20px",
            cursor: "pointer",
            marginLeft: "8px",
          }}
          title="Settings"
        >
          ⚙
        </button>
      </nav>

      {/* Modal */}
      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </>
  );
}
