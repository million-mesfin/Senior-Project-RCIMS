import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfessionalStyles/AttachPatient.css";

const AttachPatient = () => {
    const [currentDepartment, setCurrentDepartment] = useState("");
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState("");
    const [department, setDepartment] = useState("");
    const [message, setMessage] = useState("");

    // Fetch professionals and patients when the component mounts
    useEffect(() => {
        fetchPatients();
    }, []);

    let currentProfessional = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            // get professional with the currently logged in user id
            const response = await axios.get(
                `http://localhost:5000/api/professionals/get-professional-by-user-id/${user._id}`
            );
            setCurrentDepartment(response.data.professional[0].department);
            return response;
        } catch (error) {
            console.error("Error fetching current professional:", error);
            throw error;
        }
    };

    const fetchPatients = async () => {
        try {
            const professionalResponse = await currentProfessional();
            // console.log("Professional Response:", professionalResponse);

            if (professionalResponse && professionalResponse.data && professionalResponse.data.professional && professionalResponse.data.professional.length > 0) {
                const professional = professionalResponse.data.professional[0];
                // console.log("Professional ID:", professional._id);
                const response = await axios.get(
                    `http://localhost:5000/api/professionals/get-patients-of-professional/${professional._id}`
                );
                setPatients(response.data || []); // Use an empty array if undefined
            } else {
                console.error("No valid professional data available:", professionalResponse);
                setPatients([]); // Set to empty array if no professional data
            }
        } catch (error) {
            console.error("Error fetching patients:", error);
            setPatients([]); // Set to empty array on error
        }
    };

    const handleAttachPatient = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:5000/api/professionals/attach-patient",
                {
                    professionalId: null,
                    patientId: selectedPatient,
                    department: department,
                }
            );
            setMessage(response.data.message);
            alert(response.data.message);
        } catch (error) {
            console.error("Error attaching patient:", error);
            setMessage("Failed to attach patient.");
        }
    };

    return (
        <div className="attach-detach-container">
            <h2>Attach Patient to Professional</h2>

            {message && <p>{message}</p>}

            <form onSubmit={handleAttachPatient}>
                <label>Select Patient:</label>
                <select
                    value={selectedPatient}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                    required
                >
                    <option value="">-- Select Patient --</option>
                    {patients && patients.map((patient) => (
                        <option key={patient._id} value={patient._id}>
                            {patient.user.name}
                        </option>
                    ))}
                </select>

                <label>Department:</label>
                <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                >
                    <option value="">Select a department</option>
                    <option value="MD" disabled={currentDepartment === "MD"}>MD</option>
                    <option value="Psychiatry" disabled={currentDepartment === "Psychiatry"}>Psychiatry</option>
                    <option value="Physical" disabled={currentDepartment === "Physical"}>Physical</option>
                    <option value="Addiction Counseling" disabled={currentDepartment === "Addiction Counseling"}>Addiction Counseling</option>
                </select>

                <button type="submit">Attach Patient</button>
            </form>
        </div>
    );
};

export default AttachPatient;
