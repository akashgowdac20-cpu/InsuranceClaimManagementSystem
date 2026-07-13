import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    return (

        <div className="container mt-5">

            <div className="card shadow p-4">

                <h2 className="text-center">
                    Insurance Claim Management System
                </h2>

                <hr />

                <h4>Welcome 👋</h4>

                <p>Select an option below.</p>

                <div className="d-grid gap-3">

                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/create-claim")}
                    >
                        📝 Submit New Claim
                    </button>

                    <button
                        className="btn btn-success"
                        onClick={() => navigate("/my-claims")}
                    >
                        📂 My Claims
                    </button>

                    <button
                        className="btn btn-info text-white"
                        onClick={() => navigate("/stats")}
                    >
                        📊 Dashboard Statistics
                    </button>

                    <button
                        className="btn btn-warning"
                        onClick={() => navigate("/profile")}
                    >
                        👤 My Profile
                    </button>

                    <button
                        className="btn btn-danger"
                        onClick={logout}
                    >
                        🚪 Logout
                    </button>

                </div>

            </div>

        </div>

    );

}

export default Dashboard;