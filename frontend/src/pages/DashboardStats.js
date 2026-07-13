import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function DashboardStats() {

    const navigate = useNavigate();

    const [stats, setStats] = useState({});

    useEffect(() => {

        fetchStats();

    }, []);

    const fetchStats = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await API.get(
                "/claims/dashboard/stats",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setStats(response.data);

        } catch (error) {

            console.log(error);

            alert("Failed to load dashboard statistics.");

        }

    };

    return (

        <div className="container mt-5">

            <div className="card shadow p-4">

                <h2>Dashboard Statistics</h2>

                <hr />

                <table className="table table-bordered">

                    <tbody>

                        <tr>
                            <th>Total Claims</th>
                            <td>{stats["Total Claims"]}</td>
                        </tr>

                        <tr>
                            <th>Pending Claims</th>
                            <td>{stats["Pending Claims"]}</td>
                        </tr>

                        <tr>
                            <th>Approved Claims</th>
                            <td>{stats["Approved Claims"]}</td>
                        </tr>

                        <tr>
                            <th>Rejected Claims</th>
                            <td>{stats["Rejected Claims"]}</td>
                        </tr>

                    </tbody>

                </table>

                <button
                    className="btn btn-secondary"
                    onClick={() => navigate("/")}
                >
                    Back to Dashboard
                </button>

            </div>

        </div>

    );

}

export default DashboardStats;