import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/erky-logo.webp";
import { auth, onAuthStateChanged } from "../firebase";
import SettingsModal from "./SettingsModal";

export default function NavBar() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  return (
    <>
      <nav className="top-nav" style={{ display: "flex", alignItems: "center" }}>
        <a
          href="https://github.com/emyhrberg/cube-tracker"
          target="_blank"
          rel="noopener noreferrer"
          title="https://github.com/emyhrberg/cube-tracker"
        >
          <img className="logo" src={logo} alt="logo" width="50" height="50" />
        </a>
        <NavLink to="/timer" end>
          Timer
        </NavLink>
        <NavLink to="/stats">Stats</NavLink>
  <NavLink to="/login">{user ? (user.displayName?.split(" ")[0] || "Account") : "Log In"}</NavLink>

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
