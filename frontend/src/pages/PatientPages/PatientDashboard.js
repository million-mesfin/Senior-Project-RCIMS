import React from "react";

const PatientDashboard = ({ user }) => {
    return (
        <div>
            <h2>Patient Dashboard</h2>
            <p>Welcome, {user.name}</p>
            <p>Role: {user.role}</p>
            {/* Add more admin-specific content here */}
        </div>
    );
};

export default PatientDashboard;
