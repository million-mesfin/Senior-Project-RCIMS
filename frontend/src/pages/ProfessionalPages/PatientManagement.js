import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfessionalStyles/PatientManagement.css";
import ShowPatientDetails from "./ShowPatientDetails"; // Use the imported ShowPatientDetails
import AddPatientHistory from "./AddPatientHistory"; // Import AddPatientHistory component
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Paper,
} from "@mui/material";


const PatientManagement = () => {
  const [activeTab, setActiveTab] = useState("ListOfPatients");
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null); // Track selected patient ID for details

  useEffect(() => {
    fetchPatients();
  }, []);

  // Get current professional
  const currentProfessional = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.get(
        `http://localhost:5000/api/professionals/get-professional-by-user-id/${user._id}`
      );
      return response;
    } catch (error) {
      console.error("Error fetching current professional:", error);
      throw error;
    }
  };

  // Fetch patients of the current professional
  const fetchPatients = async () => {
    try {
      const professionalResponse = await currentProfessional();
      if (
        professionalResponse &&
        professionalResponse.data &&
        professionalResponse.data.professional &&
        professionalResponse.data.professional.length > 0
      ) {
        const professional = professionalResponse.data.professional[0];
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

  // Handle click for viewing patient's history or details
  const handleViewPatient = (patientId) => {
    setSelectedPatientId(patientId); // Store the selected patient ID
    setActiveTab("ViewPatientDetails"); // Switch to the "ViewPatientDetails" tab
  };

  // Handle click for adding patient history
  const handleAddHistory = (patientId) => {
    setSelectedPatientId(patientId); // Store the selected patient ID
    setActiveTab("AddPatientHistory"); // Switch to "AddPatientHistory" tab
  };

  // Function to go back to the list of patients
  const handleGoBack = () => {
    setActiveTab("ListOfPatients"); // Return to "ListOfPatients"
  };

  // Function to render the correct component based on the active tab
  const renderActiveTab = () => {
    switch (activeTab) {
      case "ListOfPatients":
        return (
          <ListOfPatients
            patients={patients}
            onViewPatient={handleViewPatient}
          />
        );
      case "ViewPatientDetails":
        return <ShowPatientDetails patientId={selectedPatientId} onGoBack={handleGoBack} fetchPatients={fetchPatients} />; // Pass fetchPatients to update the list after detachment
      default:
        return <ListOfPatients patients={patients} />;
    }
  };

  return (
    <div className="patient-management-page">
      {/* Navigation tabs */}
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "ListOfPatients" ? "active" : ""}`}
          onClick={() => setActiveTab("ListOfPatients")}
        >
          View All Patients
        </button>
      </div>

      {/* Render the component based on the active tab */}
      <div className="tab-content">{renderActiveTab()}</div>
    </div>
  );
};

// ListOfPatients Component
const ListOfPatients = ({ patients, onViewPatient }) => {
  return (
    
      <Paper  sx={{elevation: 0,}}>
      <div>
          <div style={styles.header}>
            <h2 style={{ margin: 0 }}>Patient List</h2>
      </div>
      
      {/* Table */}
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="patient table">
          <TableHead>
            <TableRow sx={{boxShadow: 0}}>

              <TableCell>No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Fathers Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Patient Type</TableCell>
             
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient, index) => (
              <TableRow key={patient._id} >

                <TableCell>{index + 1}</TableCell>
                <TableCell>{patient.user?.name}</TableCell>
                <TableCell>{patient.user?.fatherName}</TableCell>
                <TableCell>{patient.user?.phoneNumber}</TableCell>
                <TableCell>{patient.patientType}</TableCell>

                <TableCell>
                <button className="CareGiver-button" onClick={() => onViewPatient(patient._id)}>
                  View Details
                </button>                 
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
      </Paper>
  );
};


const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  button: {
    background: "#29f2ff"
  },
  actions: {
    display: "flex",
    alignItems: "center",
  },
  paginationContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  pageSelector: {
    display: "flex",
    alignItems: "center",
  },
  statusBadge: {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: "12px",
    color: "#fff",
    fontWeight: "bold",
  },
};
export default PatientManagement;
