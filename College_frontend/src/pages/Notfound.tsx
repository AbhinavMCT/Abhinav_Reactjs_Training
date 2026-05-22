import { Link } from "react-router-dom";
import "../styles/notfound.css";
import { decodeToken } from "../utils/Jwt.ts";

const NotFound = () => {
    let homepath = "/";

    const token = localStorage.getItem("access");
    if (token) {
        const decoderole = decodeToken(token)

        if (decoderole.role === "Admin") {
            homepath = "/admin-home";
        } else if (decoderole.role === "staff") {
            homepath = "/staff-home";
        } else if (decoderole.role === "student") {
            homepath = "/student-home";
        }
    }

    return (
        <div className="notfound-container">
            <h1 className="notfound-title">404 - Page Not Found</h1>
            <p className="notfound-message">The page you are looking for does not exist.</p>
            <Link to={homepath} className="notfound-link">Go back to Home</Link>
        </div>
    );
};

export default NotFound;