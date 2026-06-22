import { useNavigate } from "react-router-dom";
import {useDispatch} from "react-redux";
import {logout} from "../store/authSlice.ts";
import "../styles/logoutButton.css";

const LogoutButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    dispatch((logout()));
    navigate("/");
  }
  return (
    <button onClick={handleLogout} className="logout-btn">
      Logout
    </button>
  );
};

export default LogoutButton;