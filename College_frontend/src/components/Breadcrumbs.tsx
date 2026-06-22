import { Link, useLocation } from "react-router-dom";
import { decodeToken } from "../utils/Jwt.ts";

const Breadcrumbs = () => {
  const location = useLocation();

const token = localStorage.getItem("accessToken");

if (!token) {
  return null;
}

const decoded = decodeToken(token);

if (!decoded) {
  return null;
}

  const roleHomeMap: Record<string, string> = {
    Admin: "/admin-home",
    staff: "/staff-home",
    student: "/student-home",
  };

  const homePath =
    roleHomeMap[decoded?.role ?? ""] || "/";

  const pathnames = location.pathname
    .split("/")
    .filter(Boolean);

  return (
    <div className="breadcrumbs">
      <Link to={homePath}>Home</Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames
          .slice(0, index + 1)
          .join("/")}`;

        const isLast =
          index === pathnames.length - 1;

        const label = value
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) =>
            char.toUpperCase()
          );

        return (
          <span key={to}>
            {" / "}
            {isLast ? (
              label
            ) : (
              <Link to={to}>{label}</Link>
            )}
          </span>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;