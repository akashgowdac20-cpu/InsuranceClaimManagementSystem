import React, { useState } from "react";
import API from "../services/api";
import "./Login.css";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {

        try {

            const formData = new URLSearchParams();

            formData.append("username", email);
            formData.append("password", password);

            const response = await API.post(
                "/users/login",
                formData,
                {
                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded"
                    }
                }
            );

            localStorage.setItem(
                "token",
                response.data.access_token
            );

            if (response.data.user.role === "admin") {
                window.location.href = "/admin";
            } else {
                window.location.href = "/";
            }

        } catch (error) {

            if (error.response) {
                alert(error.response.data.detail);
            } else {
                alert("Unable to connect to server.");
            }

        }

    };

    return (

        <div className="login-page">

            <div className="overlay">

                <div className="left-panel">

                    <div className="brand">

                        <div className="logo">
                            🛡️
                        </div>

                        <h1>
                            Insurance Claim
                            <br />
                            Management System
                        </h1>

                        <p>
                            Secure, Fast & Reliable
                            <br />
                            Claim Processing Platform
                        </p>

                    </div>

                </div>

                <div className="right-panel">

                    <div className="login-card">

                        <h2>Welcome Back</h2>

                        <p className="subtitle">
                            Login to continue
                        </p>

                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />

                        <button onClick={handleLogin}>
                            Login
                        </button>

                        <div className="footer-text">
                            Insurance Claim Management System
                            <br />
                            © 2026
                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Login;