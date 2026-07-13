import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

function EditClaim() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [claimAmount, setClaimAmount] = useState("");

    useEffect(() => {
        fetchClaim();
    }, []);

    const fetchClaim = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await API.get(
                `/claims/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setTitle(response.data.title);
            setDescription(response.data.description);
            setClaimAmount(response.data.claim_amount);

        } catch (error) {

            console.log(error);

            alert("Failed to load claim.");

        }

    };

    const updateClaim = async () => {

        try {

            const token = localStorage.getItem("token");

            await API.put(
                `/claims/${id}`,
                {
                    title,
                    description,
                    claim_amount: Number(claimAmount)
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Claim updated successfully.");

            navigate("/my-claims");

        } catch (error) {

            console.log(error);

            alert("Failed to update claim.");

        }

    };

    return (

        <div className="container mt-5">

            <div className="card shadow p-4">

                <h2>Edit Claim</h2>

                <hr />

                <input
                    className="form-control mb-3"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                    className="form-control mb-3"
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <input
                    type="number"
                    className="form-control mb-3"
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(e.target.value)}
                />

                <button
                    className="btn btn-primary"
                    onClick={updateClaim}
                >
                    Update Claim
                </button>

            </div>

        </div>

    );

}

export default EditClaim;