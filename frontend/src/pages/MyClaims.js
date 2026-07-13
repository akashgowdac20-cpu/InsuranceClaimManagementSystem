import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function MyClaims() {

    const navigate = useNavigate();

    const [claims, setClaims] = useState([]);

    useEffect(() => {
        fetchClaims();
    }, []);

    const fetchClaims = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await API.get("/claims/", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setClaims(response.data);

        } catch (error) {

            console.log(error);
            alert("Failed to load claims.");

        }

    };

    const deleteClaim = async (id) => {

        if (!window.confirm("Are you sure you want to delete this claim?")) {
            return;
        }

        try {

            const token = localStorage.getItem("token");

            await API.delete(`/claims/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert("Claim deleted successfully.");

            fetchClaims();

        } catch (error) {

            console.log(error);
            alert("Failed to delete claim.");

        }

    };

    // -------------------------
    // Download PDF
    // -------------------------
    const downloadPDF = async (id) => {

        try {

            const token = localStorage.getItem("token");

            const response = await API.get(
                `/claims/${id}/pdf`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    responseType: "blob"
                }
            );

            const blob = new Blob(
                [response.data],
                { type: "application/pdf" }
            );

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = `claim_${id}.pdf`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {

            console.log(error);

            alert("Failed to download PDF.");

        }

    };

    return (

        <div className="container mt-5">

            <div className="card shadow p-4">

                <h2>My Claims</h2>

                <hr />

                {claims.length === 0 ? (

                    <p>No claims found.</p>

                ) : (

                    <div className="table-responsive">

                        <table className="table table-bordered table-hover">

                            <thead className="table-dark">

                                <tr>

                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Created On</th>
                                    <th>Actions</th>

                                </tr>

                            </thead>

                            <tbody>

                                {claims.map((claim) => (

                                    <tr key={claim.id}>

                                        <td>{claim.id}</td>

                                        <td>{claim.title}</td>

                                        <td>₹ {claim.claim_amount}</td>

                                        <td>

                                            <span
                                                className={
                                                    claim.status === "Approved"
                                                        ? "badge bg-success"
                                                        : claim.status === "Rejected"
                                                        ? "badge bg-danger"
                                                        : "badge bg-warning text-dark"
                                                }
                                            >
                                                {claim.status}
                                            </span>

                                        </td>

                                        <td>

                                            {claim.created_at
                                                ? new Date(
                                                    claim.created_at
                                                ).toLocaleString("en-IN")
                                                : "-"}

                                        </td>

                                        <td>

                                            <div className="d-flex gap-2">

                                                <button
                                                    className="btn btn-warning btn-sm"
                                                    onClick={() => navigate(`/edit-claim/${claim.id}`)}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => deleteClaim(claim.id)}
                                                >
                                                    Delete
                                                </button>

                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => downloadPDF(claim.id)}
                                                >
                                                    PDF
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

                <button
                    className="btn btn-secondary mt-3"
                    onClick={() => navigate("/")}
                >
                    Back to Dashboard
                </button>

            </div>

        </div>

    );

}

export default MyClaims;