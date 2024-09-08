import React from "react";
import "../Styling/Login.css"; // Import the CSS file
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        phoneNumber: "",
        password: "",
    });
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.phoneNumber || !formData.password) {
            alert("Please enter both phone number and password.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            
            if (response.ok) {
                // Login successful
                navigate("/dashboard", {replace: true});
                
                localStorage.setItem("user", JSON.stringify(result.user));
                localStorage.setItem("token", result.token);
            } else {
                // Login failed
                alert(result.message || "Login failed. Please check your credentials and try again.");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("An error occurred. Please try again later.");
        }
    };
    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">Login</h2>
                <form>
                    <div className="input-group">
                        <label>Phone Number</label>
                        <input
                            type="tel"
                            placeholder="Enter your phone number"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="login-button"
                        onClick={handleSubmit}
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
