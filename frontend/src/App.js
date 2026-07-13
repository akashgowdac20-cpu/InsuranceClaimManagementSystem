import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateClaim from "./pages/CreateClaim";
import MyClaims from "./pages/MyClaims";
import DashboardStats from "./pages/DashboardStats";
import EditClaim from "./pages/EditClaim";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";

function App() {

    const token = localStorage.getItem("token");

    if (!token) {
        return <Login />;
    }

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Dashboard />}
                />

                <Route
                    path="/create-claim"
                    element={<CreateClaim />}
                />

                <Route
                    path="/my-claims"
                    element={<MyClaims />}
                />

                <Route
                    path="/stats"
                    element={<DashboardStats />}
                />

                <Route
                    path="/edit-claim/:id"
                    element={<EditClaim />}
                />

                <Route
                    path="/admin"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/profile"
                    element={<Profile />}
                />

            </Routes>

        </BrowserRouter>

    );

}

export default App;