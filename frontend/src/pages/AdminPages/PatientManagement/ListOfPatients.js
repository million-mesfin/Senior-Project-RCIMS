import React, { useState, useEffect } from "react";
import {
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
} from "@mui/material";
import axios from "axios";
import "../../Styling/AdminPageStyles/ListOfPatients.css";
import CaregiverDetail from "./CaregiverDetail";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DescriptionIcon from "@mui/icons-material/Description";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";

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
    const [hasCaregiver, setHasCaregiver] = useState(false); // Track if the patient has a caregiver
    const [isAddingCaregiver, setIsAddingCaregiver] = useState(false); // State for adding caregiver

    // Fetch patients on component mount and when search term or filters change
    useEffect(() => {
        fetchPatients();
    }, [searchTerm, filterPatientType, filterGender]);

    const fetchPatients = async () => {
        setError(null); // Reset error before fetching
        try {
            const response = await axios.get(
                "http://localhost:5000/api/patients/get-patients",
                {
                    params: {
                        search: searchTerm,
                        patientType: filterPatientType,
                        gender: filterGender,
                    },
                }
            );
            setPatients(response.data.patients || response.data);
        } catch (error) {
            setError(
                `Failed to fetch patients. ${
                    error.response?.data?.message || error.message
                }`
            );
        }
    };

    const fetchPatientDetails = async (patientId) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/patients/get-patient-information/${patientId}`
            );
            const patientData = response.data.patient;

            setSelectedPatient(patientData);

            // Check if the patient already has a caregiver
            if (
                patientData.caregiver &&
                Object.keys(patientData.caregiver).length > 0
            ) {
                setHasCaregiver(true); // Set caregiver status
            } else {
                setHasCaregiver(false); // No caregiver
            }

            setIsEditing(false);
            setIsViewingCaregiver(false); // Reset caregiver view when loading patient details
        } catch (error) {
            setError(
                `Failed to fetch patient details. ${
                    error.response?.data?.message || error.message
                }`
            );
        }
    };

    const handleBackToList = () => {
        setSelectedPatient(null);
        setIsEditing(false);
        setIsViewingCaregiver(false);
        setIsAddingCaregiver(false); // Reset add caregiver mode
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
                fetchPatientDetails(response.data.patient._id); // Refresh caregiver details
            }
        } catch (error) {
            setError(
                `Failed to update patient. ${
                    error.response?.data?.message || error.message
                }`
            );
        }
    };

    const handleNavigateToCaregiverDetail = () => {
        setIsViewingCaregiver(true);
    };

    const handleAddCaregiver = async (caregiverData) => {
        try {
            const response = await axios.post(
                `http://localhost:5000/api/caregiver/add-caregiver`,
                caregiverData
            );
            if (response.status === 201) {
                alert("Caregiver added successfully!");
                setHasCaregiver(true); // Set caregiver status after adding
                setIsAddingCaregiver(false); // Exit adding caregiver mode
            }
        } catch (error) {
            setError(
                `Failed to add caregiver. ${
                    error.response?.data?.message || error.message
                }`
            );
        }
    };

    const handleCaregiverFormSubmit = (e) => {
        e.preventDefault();
        const caregiverData = {
            patientId: selectedPatient._id,
            fullName: e.target.caregiverFullName.value,
            phoneNumber: e.target.phoneNumber.value,
            relationshipToPatient: e.target.relationshipToPatient.value,
            gender: e.target.gender.value,
            address: e.target.address.value,
            officialIdNumber: e.target.officialIdNumber.value,
        };
        handleAddCaregiver(caregiverData);
    };

    const calculateAge = (selectedPatient) => {
        let dob = selectedPatient.user?.dateOfBirth;
        if (!dob) return "N/A";

        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }

        return age;
    };
    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleDateString();
  };

    // Filtered and search results rendering
    const filteredPatients = patients.filter((patient) => {
        const fullName =
            `${patient.user?.name} ${patient.user?.fatherName} ${patient.user?.grandfatherName}`.toLowerCase();
        const matchesSearchTerm = fullName.includes(searchTerm.toLowerCase());
        const matchesPatientType =
            !filterPatientType || patient.patientType === filterPatientType;
        const matchesGender =
            !filterGender || patient.user?.gender === filterGender;
        return matchesSearchTerm && matchesPatientType && matchesGender;
    });

    return (
        // <div className="patients-list-container">
        <Paper elevation={0} sx={{ p: 2, borderRadius: 4 }}>
            {/* {error && <div className="error-message">{error}</div>} */}
            {selectedPatient ? (
                isEditing ? (
                    <div>
                        <div className="header">
                            <ArrowBackIcon onClick={handleBackToList} />
                            <h2 className="patient-name">Edit Patient</h2>
                        </div>

                        <form onSubmit={handleEditSubmit} noValidate>
                            <div className="container">
                                <TextField
                                    label="Name"
                                    name="name"
                                    value={editFormData.name}
                                    onChange={handleEditFormChange}
                                    required
                                    fullWidth
                                    sx={{ paddingRight: "5px" }}
                                />

                                {/* Father's Name */}
                                <TextField
                                    label="Father's Name"
                                    name="fatherName"
                                    value={editFormData.fatherName}
                                    onChange={handleEditFormChange}
                                    fullWidth
                                    required
                                />
                            </div>
                            <div className="container">
                                {/* Grandfather's Name */}
                                <TextField
                                    label="Grandfather's Name"
                                    name="grandfatherName"
                                    value={editFormData.grandfatherName}
                                    onChange={handleEditFormChange}
                                    fullWidth
                                    sx={{ paddingRight: "25px" }}
                                    required
                                />

                                {/* Phone Number */}
                                <TextField
                                    label="Phone Number"
                                    name="phoneNumber"
                                    value={editFormData.phoneNumber}
                                    onChange={handleEditFormChange}
                                    // error={Boolean(error.phoneNumber)}
                                    // helperText={error.phoneNumber}
                                    required
                                    fullWidth
                                />
                            </div>

                            <div className="container">
                                {/* Address */}
                                <TextField
                                    label="Address"
                                    name="address"
                                    value={editFormData.address}
                                    onChange={handleEditFormChange}
                                    fullWidth
                                    required
                                />

                                {/* Date of Birth */}
                                <TextField
                                    label="Date of Birth"
                                    type="date"
                                    name="dateOfBirth"
                                    value={editFormData.dateOfBirth}
                                    onChange={handleEditFormChange}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                    fullWidth
                                    sx={{ paddingLeft: "10px" }}
                                />
                            </div>

                            <div className="container">
                                {/* Gender */}
                                <FormControl
                                    fullWidth
                                    sx={{ paddingRight: "10px" }}
                                    required
                                >
                                    <InputLabel>Gender</InputLabel>
                                    <Select
                                        name="gender"
                                        value={editFormData.gender}
                                        onChange={handleEditFormChange}
                                    >
                                        <MenuItem value="male">Male</MenuItem>
                                        <MenuItem value="female">
                                            Female
                                        </MenuItem>
                                    </Select>
                                </FormControl>

                                {/* Patient Type */}
                                <FormControl
                                    fullWidth
                                    sx={{ paddingLeft: "10px" }}
                                    required
                                >
                                    <InputLabel>Patient Type</InputLabel>
                                    <Select
                                        name="patientType"
                                        value={editFormData.patientType}
                                        onChange={handleEditFormChange}
                                    >
                                        <MenuItem value="In-patient">
                                            In-patient
                                        </MenuItem>
                                        <MenuItem value="Out-patient">
                                            Out-patient
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </div>

                            <div className="container">
                                {/* Allergies */}
                                <TextField
                                    label="Allergies"
                                    name="allergies"
                                    value={editFormData.allergies}
                                    onChange={handleEditFormChange}
                                    fullWidth
                                    required
                                />
                            </div>
                            <Box
                                sx={{
                                    width: "100%",
                                    display: "flex",
                                    gap: "20px",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Button
                                    type="submit"
                                    onClick={() => handleEditSubmit}
                                    variant="contained"
                                    color="primary"
                                    className="w-full flex justify-center bg-gradient-to-r from-cyan-300 to-blue-800  text-gray-100 p-4 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
                                >
                                    {" "}
                                    Save
                                </Button>
                                <Button
                                    type="submit"
                                    onClick={() => setIsEditing(false)}
                                    variant="contained"
                                    color="primary"
                                    className="w-full flex justify-center bg-gradient-to-r from-cyan-300 to-blue-800  text-gray-100 p-4 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </form>
                    </div>
                ) : isViewingCaregiver ? (
                    <CaregiverDetail
                        patientId={selectedPatient._id}
                        onBack={handleBackToList}
                    />
                ) : isAddingCaregiver ? (
                    <div className="add-caregiver-form">
                        <h2>Add Caregiver</h2>
                        <form onSubmit={handleCaregiverFormSubmit} noValidate>
                            {/* Caregiver Full Name */}
                            <TextField
                                label="Caregiver Full Name"
                                name="caregiverFullName"
                                required
                                fullWidth
                            />

                            {/* Phone Number */}
                            <TextField
                                label="Phone Number"
                                name="phoneNumber"
                                required
                                fullWidth
                            />

                            {/* Relationship to Patient */}
                            <TextField
                                label="Relationship to Patient"
                                name="relationshipToPatient"
                                required
                                fullWidth
                            />

                            {/* Gender */}
                            <FormControl fullWidth required>
                                <InputLabel>Gender</InputLabel>
                                <Select name="gender" label="Gender">
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                </Select>
                            </FormControl>

                            {/* Address */}
                            <TextField
                                label="Address"
                                name="address"
                                required
                                fullWidth
                            />

                            {/* Official ID Number */}
                            <TextField
                                label="Official ID Number"
                                name="officialIdNumber"
                                required
                                fullWidth
                            />

                            {/* Buttons */}
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mt: 2,
                                }}
                            >
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                >
                                    Submit
                                </Button>
                                <Button
                                    type="submit"
                                    variant="outlined"
                                    onClick={() => setIsAddingCaregiver(false)}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </form>
                    </div>
                ) : (
                    <div className="detail-container">
                        <div class="header">
                            <ArrowBackIcon
                                className=".back-button"
                                onClick={handleBackToList}
                            />
                            <h2 class="patient-name">{`${selectedPatient.user?.name} ${selectedPatient.user?.fatherName} ${selectedPatient.user?.grandfatherName}`}</h2>
                        </div>
                        <div className="container">
                            <div className="column1">
                                <div className="detail-item">
                                    <p>Name</p>
                                    <strong>
                                        {" "}
                                        {selectedPatient.user?.name}
                                    </strong>
                                </div>
                                <div class="detail-item">
                                    <p>Gender</p>
                                    <strong>
                                        {" "}
                                        {selectedPatient.user?.gender}
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <p>Age:</p>
                                    <strong>
                                        {calculateAge(selectedPatient)}
                                    </strong>
                                </div>
                                <div class="detail-item">
                                    <p>Phone</p>
                                    <strong>
                                        {selectedPatient.user?.phoneNumber}
                                    </strong>
                                </div>
                                <div className="icons-section">
                                    <div className="icon-item">
                                        <SupervisorAccountIcon
                                            onClick={
                                                handleNavigateToCaregiverDetail
                                            }
                                            sx={{ width: 100, height: 40 }}
                                        />
                                        <p>CareGiver </p>
                                    </div>
                                </div>
                            </div>

                            <div className="column2">
                                <div className="detail-item">
                                    <p>Patient Type</p>
                                    <strong>
                                        {selectedPatient.patientType}
                                    </strong>
                                </div>
                                <div className="detail-item">
                                    <p>Admitted on:</p>
                                    <strong>{formatDate(selectedPatient.user?.createdAt)}</strong>
                                </div>

                                <div className="detail-item">
                                    <p>Allergies </p>
                                    <strong>{selectedPatient.allergies}</strong>
                                </div>
                                <div class="detail-item">
                                    <p>Address</p>
                                    <strong>
                                        {selectedPatient.user?.address}
                                    </strong>
                                </div>
                                <div className="action-buttons">
                                    <button
                                        className="edit-button"
                                        onClick={() =>
                                            handleEdit(selectedPatient)
                                        }
                                    >
                                        Edit
                                    </button>
                                    {/* Conditionally render based on caregiver existence */}
                                    {hasCaregiver ? (
                                        <button
                                            className="CareGiver-button"
                                            onClick={
                                                handleNavigateToCaregiverDetail
                                            }
                                        >
                                            Caregiver Details
                                        </button>
                                    ) : (
                                        <button
                                            className="CareGiver-button"
                                            onClick={() =>
                                                setIsAddingCaregiver(true)
                                            }
                                        >
                                            Add Caregiver
                                        </button>
                                    )}
                                    {/* <button className="CareGiver-button" onClick={handleNavigateToCaregiverDetail}>Caregiver Details</button> */}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            ) : (
                <div>
                    <div style={styles.header}>
                        <h2 style={{ margin: 0 }}>Patient List</h2>
                        <div style={styles.actions}>
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
                                onChange={(e) =>
                                    setFilterPatientType(e.target.value)
                                }
                            >
                                <option value="">All Patient Types</option>
                                <option value="In-patient">In-patient</option>
                                <option value="Out-patient">Out-patient</option>
                            </select>
                            <select
                                className="filter-select"
                                value={filterGender}
                                onChange={(e) =>
                                    setFilterGender(e.target.value)
                                }
                            >
                                <option value="">All Genders</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <TableContainer>
                        <Table
                            sx={{ minWidth: 650 }}
                            aria-label="patient table"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell>No</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Fathers Name</TableCell>
                                    <TableCell>Phone Number</TableCell>
                                    <TableCell>Patient Type</TableCell>
                                    <TableCell>Gender</TableCell>

                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredPatients.map((patient, index) => (
                                    <TableRow key={patient._id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            {patient.user?.name}
                                        </TableCell>
                                        <TableCell>
                                            {patient.user?.fatherName}
                                        </TableCell>
                                        <TableCell>
                                            {patient.user?.phoneNumber}
                                        </TableCell>
                                        <TableCell>
                                            {patient.patientType}
                                        </TableCell>
                                        <TableCell>
                                            {patient.user?.gender}
                                        </TableCell>

                                        {/* <TableCell>
                  <span style={{ ...styles.statusBadge, backgroundColor: row.statusColor }}>
                    {row.status}
                  </span>
                </TableCell> */}
                                        <TableCell>
                                            <MoreHorizIcon
                                                sx={{ color: "#0891b2" }}
                                                onClick={() =>
                                                    fetchPatientDetails(
                                                        patient._id
                                                    )
                                                }
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            )}
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
        background: "#29f2ff",
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
export default ListOfPatients;
