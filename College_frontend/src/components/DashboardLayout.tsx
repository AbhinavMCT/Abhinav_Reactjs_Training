import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar.tsx";
import Header from "./Header.tsx";
import "../styles/layout.css";
import { FaBars } from "react-icons/fa";
import Breadcrumbs from "../components/Breadcrumbs.tsx";

interface MenuItem {
  name: string;
  path: string;
}

interface Props {
  children: ReactNode;
  title: string;
  username: string;
  role: string;
  menuItems: MenuItem[];
}

const DashboardLayout = ({
  children,
  title,
  username,
  role,
  menuItems,
}: Props) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="dashboard-container">
      <button
        className="menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <FaBars />
      </button>
      <Sidebar username={username} role={role} menuItems={menuItems} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>

      <div className="main-content">
        <Header title={title} />
         <Breadcrumbs />
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;