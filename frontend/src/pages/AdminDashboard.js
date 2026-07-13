import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {

    const navigate = useNavigate();

    const [claims, setClaims] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    useEffect(() => {
        fetchClaims();
    }, []);

    const fetchClaims = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await API.get(
                "/claims/admin/all",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setClaims(response.data);

        } catch (error) {

            console.log(error);
            alert("Failed to load claims.");

        }

    };

    const updateStatus = async (id, status) => {

        try {

            const token = localStorage.getItem("token");

            await API.put(
                `/claims/${id}/status?status=${status}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Status Updated Successfully!");

            fetchClaims();

        } catch (error) {

            console.log(error);
            alert("Failed to update status.");

        }

    };

    const downloadExcel = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await API.get(
                "/claims/admin/export",
                {
                    responseType: "blob",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const blob = new Blob(
                [response.data],
                {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                }
            );

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = "All_Insurance_Claims.xlsx";

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {

            console.log(error);

            alert("Failed to export Excel.");

        }

    };

    const logout = () => {

        localStorage.removeItem("token");

        window.location.href = "/";

    };

    const filteredClaims = claims.filter((claim) => {

        const matchesSearch =
            claim.customer.toLowerCase().includes(search.toLowerCase()) ||
            claim.title.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === "All" ||
            claim.status === statusFilter;

        return matchesSearch && matchesStatus;

    });

    return (

        <div className="container-fluid mt-4">

            <div className="card shadow p-4">

                <h2 className="text-center mb-4">
                    Admin Dashboard
                </h2>

                <div className="row mb-4">

                    <div className="col-md-8 mb-2">

                        <input
                            className="form-control"
                            placeholder="Search by Customer or Claim Title"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                    </div>

                    <div className="col-md-4">

                        <select
                            className="form-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option>All</option>
                            <option>Pending</option>
                            <option>Approved</option>
                            <option>Rejected</option>
                        </select>

                    </div>

                </div>

                <div className="table-responsive">

                    <table className="table table-bordered table-hover align-middle">

                        <thead className="table-dark">

                            <tr>

                                <th>ID</th>
                                <th>Customer</th>
                                <th>Email</th>
                                <th>Title</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Created On</th>
                                <th>Image</th>
                                <th>Actions</th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredClaims.map((claim) => (

                                <tr key={claim.id}>

                                    <td>{claim.id}</td>

                                    <td>{claim.customer}</td>

                                    <td>{claim.email}</td>

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
                                            ? new Date(claim.created_at).toLocaleString("en-IN")
                                            : "-"}

                                    </td>

                                    <td>

                                        {claim.image ? (

                                            <a
                                                href={`http://127.0.0.1:8000/uploads/${claim.image}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="btn btn-info btn-sm"
                                            >
                                                View Image
                                            </a>

                                        ) : (

                                            <span className="text-muted">
                                                No Image
                                            </span>

                                        )}

                                    </td>

                                    <td>

                                        <button
                                            className="btn btn-success btn-sm w-100 mb-2"
                                            onClick={() =>
                                                updateStatus(claim.id, "Approved")
                                            }
                                        >
                                            Approve
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm w-100"
                                            onClick={() =>
                                                updateStatus(claim.id, "Rejected")
                                            }
                                        >
                                            Reject
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

                <div className="mt-3">

                    <button
                        className="btn btn-success me-2"
                        onClick={downloadExcel}
                    >
                        Export Excel
                    </button>

                    <button
                        className="btn btn-secondary me-2"
                        onClick={() => navigate("/")}
                    >
                        Back
                    </button>

                    <button
                        className="btn btn-danger"
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </div>

        </div>

    );

}

export default AdminDashboard;