import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Styling/AdminPageStyles/ListOfPatients.css";
import CaregiverDetail from "./CaregiverDetail";

const ListOfPatients = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [filterPatientType, setFilterPatientType] = useState("");
    const [filterGender, setFilterGender] = useState("");
    const [error, setError] = useState(null);
    const [isViewingCaregiver, setIsViewingCaregiver] = useState(false);

    // Fetch patients on component mount and when search term or filters change
    useEffect(() => {
        fetchPatients();
    }, [searchTerm, filterPatientType, filterGender]);

    const fetchPatients = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/patients/get-patients", {
                params: {
                    search: searchTerm, // Search term parameter for searching
                    patientType: filterPatientType,
                    gender: filterGender,
                },
            });
            setPatients(response.data.patients || response.data); // handle data based on response format
        } catch (error) {
            setError(`Failed to fetch patients. ${error.response?.data?.message || error.message}`);
        }
    };

    const handleDetails = async (patientId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/patients/get-patient-information/${patientId}`);
            setSelectedPatient(response.data.patient);
            setIsEditing(false);
            setIsViewingCaregiver(false); // Reset caregiver view when loading patient details
        } catch (error) {
            setError(`Failed to fetch patient details. ${error.response?.data?.message || error.message}`);
        }
    };

    const handleBackToList = () => {
        setSelectedPatient(null);
        setIsEditing(false);
        setIsViewingCaregiver(false);
    };

    const handleEdit = (patient) => {
        setSelectedPatient(patient);
        setEditFormData({
            _id: patient._id,
            name: patient.user?.name || "",
            fatherName: patient.user?.fatherName || "",
            grandfatherName: patient.user?.grandfatherName || "",
            phoneNumber: patient.user?.phoneNumber || "",
            address: patient.user?.address || "",
            dateOfBirth: patient.user?.dateOfBirth
                ? new Date(patient.user.dateOfBirth).toISOString().split("T")[0]
                : "",
            gender: patient.user?.gender || "",
            patientType: patient.patientType || "",
            allergies: patient.allergies || "",
            status: patient.status || "",
        });
        setIsEditing(true);
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `http://localhost:5000/api/patients/update-patient/${editFormData._id}`,
                editFormData
            );
            if (response.status === 200) {
                alert("Patient updated successfully");
                fetchPatients(); // Refresh the patient list after updating
                setIsEditing(false);
                handleDetails(response.data.patient._id); // Show the updated details
            }
        } catch (error) {
            setError(`Failed to update patient. ${error.response?.data?.message || error.message}`);
        }
    };

    const handleRemove = async (patientId) => {
        const isConfirmed = window.confirm("Are you sure you want to discharge this patient?");
        if (isConfirmed) {
            try {
                await axios.put(`http://localhost:5000/api/patients/discharge-patient/${patientId}`);
                alert("Patient discharged successfully");
                fetchPatients(); // Refresh the patient list after discharge
            } catch (error) {
                setError(`Failed to discharge patient. ${error.response?.data?.message || error.message}`);
            }
        }
    };

    const handleNavigateToCaregiverDetail = () => {
        setIsViewingCaregiver(true);
    };

    // Filtered and search results rendering
    const filteredPatients = patients.filter((patient) => {
        const fullName = `${patient.user?.name} ${patient.user?.fatherName} ${patient.user?.grandfatherName}`.toLowerCase();
        const matchesSearchTerm = fullName.includes(searchTerm.toLowerCase());
        const matchesPatientType = !filterPatientType || patient.patientType === filterPatientType;
        const matchesGender = !filterGender || patient.user?.gender === filterGender;
        return matchesSearchTerm && matchesPatientType && matchesGender;
    });

    return (
        <div className="patients-list-container">
            {error && <div className="error-message">{error}</div>}
            {selectedPatient ? (
                isEditing ? (
                    <div>
                        {/* Back button added at the top of the edit page */}
                        <button className="back-button" onClick={handleBackToList}>
                            Back to List
                        </button>
                        <h2>Edit Patient</h2>
                        <form onSubmit={handleEditSubmit}>
                            <div>
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editFormData.name}
                                    onChange={handleEditFormChange}
                                />
                            </div>
                            <div>
                                <label>Father's Name</label>
                                <input
                                    type="text"
                                    name="fatherName"
                                    value={editFormData.fatherName}
                                    onChange={handleEditFormChange}
                                />
                            </div>
                            <div>
                                <label>Grandfather's Name</label>
                                <input
                                    type="text"
                                    name="grandfatherName"
                                    value={editFormData.grandfatherName}
                                    onChange={handleEditFormChange}
                                />
                            </div>
                            <div>
                                <label>Phone Number</label>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={editFormData.phoneNumber}
                                    onChange={handleEditFormChange}
                                />
                            </div>
                            <div>
                                <label>Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={editFormData.address}
                                    onChange={handleEditFormChange}
                                />
                            </div>
                            <div>
                                <label>Date of Birth</label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={editFormData.dateOfBirth}
                                    onChange={handleEditFormChange}
                                />
                            </div>
                            <div>
                                <label>Gender</label>
                                <select
                                    name="gender"
                                    value={editFormData.gender}
                                    onChange={handleEditFormChange}
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <div>
                                <label>Patient Type</label>
                                <select
                                    name="patientType"
                                    value={editFormData.patientType}
                                    onChange={handleEditFormChange}
                                >
                                    <option value="In-patient">In-patient</option>
                                    <option value="Out-patient">Out-patient</option>
                                </select>
                            </div>
                            <div>
                                <label>Allergies</label>
                                <input
                                    type="text"
                                    name="allergies"
                                    value={editFormData.allergies}
                                    onChange={handleEditFormChange}
                                />
                            </div>
                            <button type="submit">Save</button>
                            <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                        </form>
                    </div>
                ) : isViewingCaregiver ? (
                    <CaregiverDetail patientId={selectedPatient._id} onBack={handleBackToList} />
                ) : (
                    <div className="patient-details">
                        <h2>Patient Details</h2>
                        <button className="back-button" onClick={handleBackToList}>Back to List</button>
                        <h3>{`${selectedPatient.user?.name} ${selectedPatient.user?.fatherName} ${selectedPatient.user?.grandfatherName}`}</h3>
                        <p><strong>Phone:</strong> {selectedPatient.user?.phoneNumber}</p>
                        <p><strong>Address:</strong> {selectedPatient.user?.address}</p>
                        <p><strong>Patient Type:</strong> {selectedPatient.patientType}</p>
                        <p><strong>Allergies:</strong> {selectedPatient.allergies}</p>
                        <button className="btn btn-edit" onClick={() => handleEdit(selectedPatient)}>Edit</button>
                        <button className="btn btn-caregiver" onClick={handleNavigateToCaregiverDetail}>Caregiver Details</button>
                    </div>
                )
            ) : (
                <div>
                    <h1>Patient List</h1>
                    <div className="search-filter-section">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search by name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                            className="filter-select"
                            value={filterPatientType}
                            onChange={(e) => setFilterPatientType(e.target.value)}
                        >
                            <option value="">All Patient Types</option>
                            <option value="In-patient">In-patient</option>
                            <option value="Out-patient">Out-patient</option>
                        </select>
                        <select
                            className="filter-select"
                            value={filterGender}
                            onChange={(e) => setFilterGender(e.target.value)}
                        >
                            <option value="">All Genders</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <ul className="patients-list">
                        {filteredPatients.map((patient) => (
                            <li key={patient._id} className="patient-item">
                                <div className="patient-info">
                                    <h2>{`${patient.user?.name} ${patient.user?.fatherName} ${patient.user?.grandfatherName}`}</h2>
                                    <p><strong>Phone Number:</strong> {patient.user?.phoneNumber}</p>
                                    <p><strong>Patient Type:</strong> {patient.patientType}</p>
                                </div>
                                <div className="patient-actions">
                                    <button className="btn btn-details" onClick={() => handleDetails(patient._id)}>
                                        Details
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ListOfPatients;
