import { NavLink } from "react-router-dom";
import "../styles/layout.css";
import LogoutButton from "./LogoutButton.tsx";

interface MenuItem {
  name: string;
  path: string;
}

interface SidebarProps {
  role: string;
  menuItems: MenuItem[];
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
}

const Sidebar = ({
  role,
  menuItems,
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) => {

  return (
    <div className={`sidebar ${sidebarOpen ? "active" : ""}`}>

      <h2>{role} Panel</h2>

      <ul>
        {menuItems.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.path}
              className="nav-link"
              onClick={() => setSidebarOpen(false)}
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="logout-container">
        <LogoutButton />
      </div>
    </div>
  );
};

export default Sidebar;