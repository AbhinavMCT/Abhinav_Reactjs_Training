/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { loginUser } from "../../api/loginApi.tsx";
import { useNavigate } from "react-router-dom";
import "../../css/login.css";
import type { LoginCredentials } from "../../types/datatypes.tsx";

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<LoginCredentials>({
        username: "",
        password: ""
    });

    const [error, setError] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        try {
            const res = await loginUser(formData);
            localStorage.setItem("access", res.data.token);
            navigate("/userhome");
        } catch (err: any) {
            const errMsg = err.response?.data?.message || "Something went wrong. Please try again.";
            setError(errMsg);
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
                        <input type="text" name="username" className="form-control" placeholder="Enter Username" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password:</label>
                        <input type="password" name="password" className="form-control" placeholder="Enter Password" onChange={handleChange} required />
                    </div>

                    <button type="submit" className="btn-submit">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default Login;