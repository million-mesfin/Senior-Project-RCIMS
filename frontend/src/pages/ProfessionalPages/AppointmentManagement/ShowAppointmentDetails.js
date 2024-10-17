import React, { useState, useEffect } from "react";
import axios from "axios";

const ShowAppointmentDetails = ({ appointmentId, onGoBack, onEditAppointment }) => {
    const [appointmentDetails, setAppointmentDetails] = useState(null);
    const [error, setError] = useState(null);
    const [patientType, setPatientType] = useState(null);
    const [patientName, setPatientName] = useState(null);
    const [professionalName, setProfessionalName] = useState(null);
    useEffect(() => {
        fetchAppointmentDetails();
    }, [appointmentId]);

    const fetchAppointmentDetails = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/appointment/appointment-details/${appointmentId}`
            );

            if (response.data && response.data.appointment) {
                setAppointmentDetails(response.data.appointment);
                setPatientType(response.data.patientType);
                setPatientName(response.data.patientName);
                setProfessionalName(response.data.professionalName);
            } else {
                setError("Appointment details not found");
            }
        } catch (error) {
            console.error("Error fetching appointment details:", error);
            setError("Error fetching appointment details: " + error.message);
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!appointmentDetails) {
        return <div>Loading...</div>;
    }

    // Format the date
    const formattedDate = new Date(appointmentDetails.date).toUTCString().split(' ').slice(0, 4).join(' ');
    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.substr(1);
    }

    const onCancelAppointment = async () => {
        try {
            // show a confirmation dialog to the user
            const confirmation = window.confirm("Are you sure you want to cancel this appointment?");
            
            if (confirmation) {
                await axios.delete(`http://localhost:5000/api/appointment/cancel-appointment/${appointmentId}`);
                onGoBack(true);
            }
        } catch (error) {
            console.error("Error canceling appointment:", error);
            setError("Error canceling appointment: " + error.message);
        }
    };
    return (
        <div className="appointment-details">
            <h2>Appointment Details</h2>
            <p>Date: <strong>{formattedDate}</strong></p>
            <p>Session Number: <strong>{appointmentDetails.sessionNumber}</strong></p>
            <p>Duration: <strong>{appointmentDetails.duration} Hr</strong></p>
            <p>Patient Name: <strong>{patientName || "Not available"}</strong></p>
            <p>Patient Type: <strong>{patientType || "Not specified"}</strong></p>
            <p>
                Appointment Type:{" "}
                <strong>{capitalizeFirstLetter(appointmentDetails.type)}</strong>
            </p>
            <p>
                Status:{" "}
                <span
                    style={{
                        color:
                            appointmentDetails.status === "active"
                                ? "green"
                                : "red",
                    }}
                >
                    <strong>
                        {capitalizeFirstLetter(appointmentDetails.status)}
                    </strong>
                </span>
            </p>
            {/* Add more details as needed */}
            <div className="button-group">
                <button onClick={onGoBack}>Back to List</button>
                <button onClick={() => onEditAppointment(appointmentDetails._id)}>Edit Appointment</button>
                <button onClick={() => onCancelAppointment(appointmentDetails._id)}>Cancel Appointment</button>
            </div>
        </div>
    );
};

export default ShowAppointmentDetails;
