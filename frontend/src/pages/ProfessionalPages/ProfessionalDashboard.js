import React from "react";

const ProfessionalDashboard = ({ user }) => {
    return (
        <div>
            <h2>Professional Dashboard</h2>
            <p>Welcome, {user.name}</p>
            <p>Role: {user.role}</p>
            {/* Add more admin-specific content here */}
        </div>
    );
};

export default ProfessionalDashboard;
