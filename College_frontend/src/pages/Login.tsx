import  { useState } from "react";
import { loginUser } from "../services/LoginApi.ts";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import type { LoginCredentials } from "../types/Datatypes.ts";
import {decodeToken} from "../utils/Jwt.ts";

const Login = () => {   
    const navigate = useNavigate();

    const [formData, setFormData] = useState<LoginCredentials>({
        username: "",
        password: ""
    });
    const [loading, setLoading] = useState<boolean>(false);

    const [error, setError] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async(e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loading) return; 
        setLoading(true);
        
        setError("");
        try {
            const res = await loginUser(formData);
            const token = res.data.token;
            localStorage.setItem("access", token);
            const decoded = decodeToken(token);

            if (decoded.role === "Admin") {
                navigate("/admin-home", { replace: true });
            } else if (decoded.role === "staff") {
                navigate("/staff-home");
            } else if(decoded.role === "student") {
                navigate("/student-home");
            }else{
                navigate("/");
            }
        } catch (err: unknown) {
            const errMsg = (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Something went wrong. Please try again.";
            setError(errMsg);
        }finally {
            setLoading(false);
        }
    }

    return (
        <div className="page-center">
            <div className="login-container">
                <h2>Login</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username" className="form-label">Username:</label>
                        <input type="text" name="username" id="username" className="form-control" placeholder="Enter Username" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password:</label>
                        <input type="password" name="password" id="password" className="form-control" placeholder="Enter Password" onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn-submit">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default Login;