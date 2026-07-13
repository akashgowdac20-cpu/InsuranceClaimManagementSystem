import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function CreateClaim() {

    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [claimAmount, setClaimAmount] = useState("");
    const [image, setImage] = useState(null);

    const submitClaim = async () => {

        try {

            const token = localStorage.getItem("token");

            const formData = new FormData();

            formData.append("title", title);
            formData.append("description", description);
            formData.append("claim_amount", claimAmount);

            if (image) {
                formData.append("image", image);
            }

            const response = await API.post(
                "/claims/",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            console.log(response.data);

            alert("Claim Created Successfully!");

            navigate("/my-claims");

        } catch (error) {

            console.log(error);

            if (error.response) {
                alert(JSON.stringify(error.response.data, null, 2));
            } else {
                alert("Something went wrong.");
            }

        }

    };

    return (

        <div className="container mt-5">

            <div className="card shadow p-4">

                <h2>Create Insurance Claim</h2>

                <hr />

                <input
                    className="form-control mb-3"
                    placeholder="Claim Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                    className="form-control mb-3"
                    placeholder="Description"
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <input
                    type="number"
                    className="form-control mb-3"
                    placeholder="Claim Amount"
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(e.target.value)}
                />

                <input
                    type="file"
                    className="form-control mb-3"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                />

                <button
                    className="btn btn-primary"
                    onClick={submitClaim}
                >
                    Submit Claim
                </button>

            </div>

        </div>

    );

}

export default CreateClaim;