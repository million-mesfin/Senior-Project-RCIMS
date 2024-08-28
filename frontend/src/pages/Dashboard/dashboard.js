import React from "react";
import { useNavigate } from "react-router-dom";
import "../Styling/Dashboard.css";

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    React.useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No token found");
                }

                const response = await fetch("http://localhost:5000/api/user", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }

                const data = await response.json();
                setUser(data.user);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="dashboard-container"> {/* Apply CSS class */}
            <h1 className="dashboard-header">Dashboard</h1> {/* Apply CSS class */}
            {user && (
                <div>
                    <p className="dashboard-info">Name: {user.name}</p> {/* Apply CSS class */}
                    <p className="dashboard-info">Father's Name: {user.fatherName}</p> {/* Apply CSS class */}
                    <p className="dashboard-info">Grandfather's Name: {user.grandfatherName}</p> {/* Apply CSS class */}
                    <p className="dashboard-info">Phone Number: {user.phoneNumber}</p> {/* Apply CSS class */}
                    <p className="dashboard-info">Role: {user.role}</p> {/* Apply CSS class */}
                    <p className="dashboard-info">
                        Date of Birth: {new Date(user.dateOfBirth).toLocaleDateString()}
                    </p> {/* Apply CSS class */}
                    <p className="dashboard-info">Gender: {user.gender}</p> {/* Apply CSS class */}
                    <p className="dashboard-info">Address: {user.address || "Not provided"}</p> {/* Apply CSS class */}
                    <p className="dashboard-info">
                        Created At: {new Date(user.createdAt).toLocaleString()}
                    </p> {/* Apply CSS class */}
                    <p className="dashboard-info">
                        Last Updated: {new Date(user.updatedAt).toLocaleString()}
                    </p> {/* Apply CSS class */}
                </div>
            )}
            <button className="dashboard-button" onClick={handleLogout}>Logout</button> {/* Apply CSS class */}
        </div>
    );
};

export default Dashboard;
