import { Link } from "react-router-dom";
import { useState } from "react";
import { NavItem } from "../types/Datatypes.ts";
import "../styles/navbar.css";

interface NavbarProps {
  title: string;
  links: NavItem[];
}

const Navbar = ({ title, links }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="container">
      <div className="navbar-container">
        <nav className="navbar-data">
          <Link className="home-nav" to="/">
            {title}
          </Link>

          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>

          <div className={`navbarContent ${menuOpen ? "active" : ""}`}>
            <ul className="navbar-list">
              {links.map((link) => (
                <li key={link.path} className="nav-links">
                  <Link
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;