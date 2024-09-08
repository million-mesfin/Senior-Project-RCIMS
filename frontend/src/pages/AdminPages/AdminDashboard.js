import React, { useState } from "react"; // Added useState import
import { useNavigate } from "react-router-dom";
import "../Styling/AdminPageStyles/adminDashboard.css";
import Appointments from "./Appointments";
import PatientManagement from "./PatientManagement";
import ProfessionalManagement from "./ProfessionalManagement/ProfessionalManagement";
import Report from "./Report";
import Contact from "./Contact";
import Help from "./Help";

const AdminDashboard = ({ user }) => {
    const navigate = useNavigate();
    const [selectedComponent, setSelectedComponent] = useState(null); // Added state for selected component

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const handleNavClick = (component) => {
        // Added function to handle nav clicks
        setSelectedComponent(component);
    };

    return (
        <div className="admin-dashboard">
            <nav className="admin-dashboard-nav">
                <div>
                    <h1>RCMIS</h1>
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                    <a
                        href="#appointments"
                        onClick={() => handleNavClick("Appointments")}
                    >
                        Appointments
                    </a>
                    <a
                        href="#patient-management"
                        onClick={() => handleNavClick("PatientManagement")}
                    >
                        Patient Management
                    </a>
                    <a
                        href="#professional-management"
                        onClick={() => handleNavClick("ProfessionalManagement")}
                    >
                        Professional Management
                    </a>
                    <a href="#report" onClick={() => handleNavClick("Report")}>
                        Report
                    </a>
                    <a
                        href="#contact"
                        onClick={() => handleNavClick("Contact")}
                    >
                        Contact
                    </a>
                    <a href="#help" onClick={() => handleNavClick("Help")}>
                        Help
                    </a>
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                    }}
                >
                    <span>{user.name}</span>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </nav>
            <div className="container">
                {selectedComponent === "Appointments" && <Appointments />}
                {selectedComponent === "PatientManagement" && (
                    <PatientManagement />
                )}
                {selectedComponent === "ProfessionalManagement" && (
                    <ProfessionalManagement />
                )}
                {selectedComponent === "Report" && <Report />}
                {selectedComponent === "Contact" && <Contact />}
                {selectedComponent === "Help" && <Help />}
            </div>
        </div>
    );
};

export default AdminDashboard;
