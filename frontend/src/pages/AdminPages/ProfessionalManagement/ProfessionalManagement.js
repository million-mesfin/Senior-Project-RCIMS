import React, { useState } from "react";
import "../../Styling/AdminPageStyles/ProfessionalManagement.css";
import ProfessionalsList from "./ProfessionalsList";
import AddProfessional from "./AddProfessional";
const ProfessionalManagement = () => {
    const [selectedOption, setSelectedOption] = useState("Professionals");

    const renderContent = () => {
        switch (selectedOption) {
            case "Professionals":
                return <ProfessionalsList />;
            case "Add Professional":
                return <AddProfessional />;
            case "Contact Professional":
                return <h2>Professional Reports</h2>;
            default:
                return null;
        }
    };

    return (
        <div className="professional-management">
            <nav className="side-nav">
                <ul>
                    <li
                        className={selectedOption === "Professionals" ? "active" : ""}
                        onClick={() => setSelectedOption("Professionals")}
                    >
                        View All
                    </li>
                    <li
                        className={selectedOption === "Add Professional" ? "active" : ""}
                        onClick={() => setSelectedOption("Add Professional")}
                    >
                        Add 
                    </li>
                    <li
                        className={selectedOption === "Contact Professional" ? "active" : ""}
                        onClick={() => setSelectedOption("Contact Professional")}
                    >
                        Report
                    </li>
                </ul>
            </nav>
            <main className="main-panel">{renderContent()}</main>
        </div>
    );
};

export default ProfessionalManagement;
