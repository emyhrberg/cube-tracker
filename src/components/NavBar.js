import { NavLink } from "react-router-dom";
import logo from "../assets/erky-logo.png";

export default function NavBar() {
  return (
    <nav className="top-nav">
      <NavLink to="/" end>Home</NavLink>
      <NavLink to="/stats">Stats</NavLink>
      <NavLink to="/settings">Settings</NavLink>

      {/* External link with tooltip */}
      <a
        href="https://github.com/emyhrberg"
        target="_blank"
        rel="noopener noreferrer"
        title="https://github.com/emyhrberg"
      >
        <img className="logo" src={logo} alt="logo" width="50" height="50" />
      </a>
    </nav>
  );
}
