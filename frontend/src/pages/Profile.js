import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Profile() {

    const navigate = useNavigate();

    const [profile, setProfile] = useState({});
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await API.get(
                "/users/profile",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setProfile(response.data);

        } catch (error) {

            console.log(error);
            alert("Failed to load profile.");

        }

    };

    const changePassword = async () => {

        if (!oldPassword || !newPassword) {
            alert("Please fill all fields.");
            return;
        }

        try {

            const token = localStorage.getItem("token");

            await API.put(
                "/users/change-password",
                {
                    old_password: oldPassword,
                    new_password: newPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Password changed successfully!");

            setOldPassword("");
            setNewPassword("");

        } catch (error) {

            console.log(error);

            if (error.response) {
                alert(error.response.data.detail);
            } else {
                alert("Failed to change password.");
            }

        }

    };

    return (

        <div className="container mt-5">

            <div className="card shadow p-4">

                <h2 className="text-center">
                    My Profile
                </h2>

                <hr />

                <div className="mb-3">

                    <label className="form-label">
                        Full Name
                    </label>

                    <input
                        className="form-control"
                        value={profile.full_name || ""}
                        disabled
                    />

                </div>

                <div className="mb-3">

                    <label className="form-label">
                        Email
                    </label>

                    <input
                        className="form-control"
                        value={profile.email || ""}
                        disabled
                    />

                </div>

                <div className="mb-4">

                    <label className="form-label">
                        Role
                    </label>

                    <input
                        className="form-control"
                        value={profile.role || ""}
                        disabled
                    />

                </div>

                <h4>Change Password</h4>

                <input
                    type="password"
                    className="form-control mb-3"
                    placeholder="Old Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                />

                <input
                    type="password"
                    className="form-control mb-3"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />

                <button
                    className="btn btn-primary me-2"
                    onClick={changePassword}
                >
                    Change Password
                </button>

                <button
                    className="btn btn-secondary"
                    onClick={() => navigate("/")}
                >
                    Back
                </button>

            </div>

        </div>

    );

}

export default Profile;