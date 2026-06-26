import { Link, useLocation } from "react-router-dom";
import { decodeToken } from "../utils/Jwt.ts";
import "../styles/breadcurmbs.css";

const Breadcrumbs = () => {
  const location = useLocation();

  const token = localStorage.getItem("accessToken");

  if (!token) return null;

  const decoded = decodeToken(token);

  if (!decoded) return null;

  const roleHomeMap: Record<string, string> = {
    Admin: "/admin-home",
    staff: "/staff-home",
    student: "/student-home",
  };

  const homePath = roleHomeMap[decoded.role ?? ""] || "/";

  const pathnames = location.pathname.split("/").filter(Boolean);

  return (
    <div className="breadcrumbs-container">
      <nav className="breadcrumbs">
        <Link to={homePath} className="breadcrumb-link">
          🏠 Home
        </Link>

        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;

          const isLast = index === pathnames.length - 1;

          const label = value.replaceAll("-", " ");

          return (
            <span key={to}>
              <span className="separator">›</span>

              {isLast ? (
                <span className="breadcrumb-current">
                  {label}
                </span>
              ) : (
                <Link to={to} className="breadcrumb-link">
                  {label}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
    </div>
  );
};

export default Breadcrumbs;