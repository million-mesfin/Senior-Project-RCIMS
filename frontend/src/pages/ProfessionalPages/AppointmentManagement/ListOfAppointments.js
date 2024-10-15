import React, { useState } from "react";
import "../ProfessionalStyles/AppointmentList.css";
import ShowAppointmentDetails from "./ShowAppointmentDetails"; // You'll need to create this component

const ListOfAppointments = ({ appointments }) => {
    // Helper function to format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Helper function to format time
    const formatTime = (dateString) => {
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleTimeString(undefined, options);
    };

    // Ensure we're working with the correct array
    const appointmentsArray = Array.isArray(appointments) ? appointments : appointments?.appointments || [];

    // Check if appointments array has items
    const hasAppointments = appointmentsArray.length > 0;

    const [activeTab, setActiveTab] = useState("ListOfAppointments");
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

    const handleDetails = (appointmentId) => {
        setSelectedAppointmentId(appointmentId);
        setActiveTab("ViewAppointmentDetails");
    };

    const handleGoBack = () => {
        setActiveTab("ListOfAppointments");
    };

    const renderActiveTab = () => {
        switch (activeTab) {
            case "ListOfAppointments":
                return renderAppointmentsList();
            case "ViewAppointmentDetails":
                return <ShowAppointmentDetails appointmentId={selectedAppointmentId} onGoBack={handleGoBack} />;
            default:
                return renderAppointmentsList();
        }
    };

    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.substr(1);
      }

    const renderAppointmentsList = () => {
        return (
            <>
                <h2>Your Appointments</h2>
                {!hasAppointments ? (
                    <p>No appointments found.</p>
                ) : (
                    <ul className="appointments-list">
                        {appointmentsArray.map((appointment) => (
                            <li key={appointment._id} className="appointment-item">
                                <div className="appointment-info">
                                    <h3>{formatDate(appointment.date)} at {formatTime(appointment.startTime)}</h3>
                                    <p><strong>Status: <span style={{ color: appointment.status === "active" ? "green" : "red" }}>{capitalizeFirstLetter(appointment.status)}</span></strong></p>
                                    
                                </div>
                                <div className="appointment-actions">
                                    <button className="btn btn-details" onClick={() => handleDetails(appointment._id)}>
                                        Details
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </>
        );
    };

    return (
        <div className="appointments-list-container">
            {renderActiveTab()}
        </div>
    );
};

export default ListOfAppointments;
