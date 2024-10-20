import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfessionalStyles/AttachPatient.css";
import "./ProfessionalStyles/ShowPatientDetails.css";

import ShowHistory from "./showhistory"; // Import the ShowHistory component
import AddPatientHistory from "./AddPatientHistory"; // Import the AddPatientHistory component
import PatientProgress from "./PatientProgress"; // Import the PatientProgress component

const ShowPatientDetails = ({ patientId, onGoBack, fetchPatients }) => {
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [currentProfessionalId, setCurrentProfessionalId] = useState(""); 
  const [showHistory, setShowHistory] = useState(false); // Track if we should show the history page
  const [addHistory, setAddHistory] = useState(false); // Track if we should navigate to AddPatientHistory page
  const [showProgress, setShowProgress] = useState(false); // Track if we should navigate to PatientProgress page
  const [message, setMessage] = useState("");

  // Fetch the current professional's ID when the component mounts
  useEffect(() => {
    const fetchCurrentProfessional = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await axios.get(
          `http://localhost:5000/api/professionals/get-professional-by-user-id/${user._id}`
        );
        if (response.data && response.data.professional && response.data.professional.length > 0) {
          setCurrentProfessionalId(response.data.professional[0]._id); // Set the professional ID
        } else {
          console.error("No professional data found for this user.");
        }
      } catch (error) {
        console.error("Error fetching current professional:", error);
        setError("Error fetching current professional.");
      }
    };

    fetchCurrentProfessional();
  }, []);

  // Fetch patient details by patientId
  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/patients/get-patients`);
        const foundPatient = response.data.find((p) => p._id === patientId); // Find the patient by ID
        setPatient(foundPatient);
        setLoading(false); // Stop loading after data is fetched
      } catch (error) {
        setError("Error fetching patient details.");
        console.error(error);
        setLoading(false); // Stop loading in case of error
      }
    };

    if (patientId) {
      fetchPatientDetails();
    }
  }, [patientId]);

  const handleDetachPatient = async () => {
    const confirmDetach = window.confirm("Are you sure you want to detach this patient?");
    if (!confirmDetach) return;
  
    try {
      if (!currentProfessionalId || !patientId) {
        alert("Professional ID or Patient ID is missing.");
        return;
      }
      
      const response = await axios.post("http://localhost:5000/api/professionals/detach-patient-from-professional", {
        professionalId: currentProfessionalId,
        patientId,
      });
      
      alert(response.data.message); // Use the message from the API response
      fetchPatients(); // Refresh the patient list after detaching
      onGoBack(); // Navigate back to the list of patients
    } catch (error) {
      console.error("Error detaching patient:", error.response ? error.response.data : error);
      const errorMessage = error.response?.data?.message || "Error detaching patient. Please try again.";
      alert(errorMessage); // Use the error message from the API or a default message
    }
  };

  // If showHistory is true, display the ShowHistory component
  if (showHistory) {
    return <ShowHistory patientId={patientId} onGoBack={() => setShowHistory(false)} />; // Pass onGoBack to return to this page
  }

  // If addHistory is true, display the AddPatientHistory component
  if (addHistory) {
    return <AddPatientHistory patientId={patientId} onGoBack={() => setAddHistory(false)} />; // Pass onGoBack to return to this page
  }

  // If showProgress is true, display the PatientProgress component
  if (showProgress) {
    return <PatientProgress patientId={patientId} onGoBack={() => setShowProgress(false)} />; // Pass onGoBack to return to this page
  }

  return (
    <div className="show-patient-details">
      {/* Back Button at the top */}
      <button className="btn btn-back" onClick={onGoBack}>
        Back
      </button>

      <h2>Patient Details</h2>
      {patient ? (
        <div className="patient-info">
          <h3>{`${patient.user?.name} ${patient.user?.fatherName} ${patient.user?.grandfatherName}`}</h3>
          <p><strong>Phone Number:</strong> {patient.user?.phoneNumber}</p>
          <p><strong>Address:</strong> {patient.user?.address}</p>
          <p><strong>Patient Type:</strong> {patient.patientType}</p>
          <p><strong>Room Number:</strong> {patient.roomNumber || "N/A"}</p>
          <p><strong>Bed Number:</strong> {patient.bedNumber || "N/A"}</p>
          <p><strong>Employment Status:</strong> {patient.employmentStatus}</p>
          <p><strong>Educational Level:</strong> {patient.educationalLevel}</p>
          <p><strong>Living Situation:</strong> {patient.livingSituation}</p>
          <p><strong>Allergies:</strong> {patient.allergies || "None"}</p>

          {/* Detach Button that calls the API */}
          <button className="btn btn-detach" onClick={handleDetachPatient}>
            Detach Patient
          </button>

          {/* New View History Button */}
          <button className="btn btn-view-history" onClick={() => setShowHistory(true)}>
            View History
          </button>

          {/* New Add History Button */}
          <button className="btn btn-add-history" onClick={() => setAddHistory(true)}>
            Add History
          </button>

          {/* New Progress Button */}
          <button className="btn btn-progress" onClick={() => setShowProgress(true)}>
            Add Progress
          </button>
        </div>
      ) : (
        <p>No patient details found.</p>
      )}
    </div>
  );
};

export default ShowPatientDetails;
