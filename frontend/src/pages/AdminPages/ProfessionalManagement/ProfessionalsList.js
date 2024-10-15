import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Styling/AdminPageStyles/ProfessionalManagementStyles/ProfessionalsList.css";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    TextField,
    Button,
    IconButton,
    InputAdornment,
    Pagination,
    Select,
    MenuItem,
    Paper,
  } from "@mui/material";
import ProfessionalDetail from "./ProfessionalDetail";

const ProfessionalsList = () => {
    const [professionals, setProfessionals] = useState([]);
    const [selectedProfessional, setSelectedProfessional] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [error, setError] = useState(null);

    // State for search and filter
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState(""); 
    const [filterSpeciality, setFilterSpeciality] = useState(""); // New filter for specialty

    useEffect(() => {
        fetchProfessionals();
    }, []);

    // Function to fetch professionals
    const fetchProfessionals = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/professionals/get-professionals"
            );
            if (Array.isArray(response.data)) {
                setProfessionals(response.data);
            } else if (
                response.data &&
                Array.isArray(response.data.professionals)
            ) {
                setProfessionals(response.data.professionals);
            } else {
                console.error("Unexpected data format:", response.data);
                setError("Received unexpected data format from the server.");
            }
        } catch (error) {
            console.error("Error fetching professionals:", error);
            setError(`Failed to fetch professionals. ${error.message}`);
        }
    };

    // Search and filter professionals
    const filteredProfessionals = professionals.filter((professional) => {
        const fullName = `${professional.user?.name} ${professional.user?.fatherName} ${professional.user?.grandfatherName}`.toLowerCase();
        const matchesSearchTerm = fullName.includes(searchTerm.toLowerCase());
        const matchesStatus =
            !filterStatus || professional.status === filterStatus;
        const matchesSpeciality =
            !filterSpeciality || professional.speciality === filterSpeciality;
        return matchesSearchTerm && matchesStatus && matchesSpeciality;
    });

    const handleDetails = (professional) => {
        setSelectedProfessional(professional);
        setIsEditing(false);
    };

    const handleBackToList = () => {
        setSelectedProfessional(null);
        setIsEditing(false);
    };

    const handleBackToDetails = async (professional) => {
        setIsEditing(false);
        setSelectedProfessional(professional);
    };

    const handleEdit = (professional) => {
        setSelectedProfessional(professional);
        setEditFormData({
            _id: professional._id,
            name: professional.user?.name || "",
            fatherName: professional.user?.fatherName || "",
            grandfatherName: professional.user?.grandfatherName || "",
            speciality: professional.speciality || "",
            phoneNumber: professional.user?.phoneNumber || "",
            address: professional.user?.address || "",
            dateOfBirth: professional.user?.dateOfBirth
                ? new Date(professional.user.dateOfBirth)
                      .toISOString()
                      .split("T")[0]
                : "",
            gender: professional.user?.gender || "",
            yearsOfExperience: professional.yearsOfExperience || "",
            qualification: professional.qualification || "",
            bio: professional.bio || "",
            languagesSpoken: professional.languagesSpoken
                ? professional.languagesSpoken.join(", ")
                : "",
            workingHours: professional.workingHours || "",
            status: professional.status || "",
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
                `http://localhost:5000/api/professionals/update-professional/${editFormData._id}`,
                editFormData
            );
            if (response.status === 200) {
                alert("Professional updated successfully");

                const updatedProfessional = response.data.professional;
                const updatedUser = response.data.user;
                const combinedData = {
                    ...updatedProfessional,
                    user: updatedUser,
                };
                fetchProfessionals();
                setIsEditing(false);
                handleBackToDetails(combinedData);
            }
        } catch (error) {
            console.error("Error updating professional:", error);
            setError(`Failed to update professional. ${error.message}`);
        }
    };
    const handleRemove = async (professionalId) => {
        const isConfirmed = window.confirm(
            "Are you sure you want to remove this professional?"
        );
        if (isConfirmed) {
            try {
                const response = await axios.delete(
                    `http://localhost:5000/api/professionals/delete-professional/${professionalId}`
                );
                if (response.status === 200) {
                    alert("Professional removed successfully");
                    setProfessionals(
                        professionals.filter((prof) => prof._id !== professionalId)
                    );
                    setSelectedProfessional(null);
                }
            } catch (error) {
                console.error("Error removing professional:", error);
                setError(`Failed to remove professional. ${error.response?.data?.message || error.message}`);
            }
        }
    };
    
    
    // A function to calculate the age of the professional
    const calculateAge = (dateOfBirth) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }
        return age;
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="professionals-list-container">
            {selectedProfessional ? (
                isEditing ? (
                    <div className="professional-edit-form">
                        <h2>Edit Professional</h2>
                        <button
                            className="back-button"
                            onClick={() =>
                                handleBackToDetails(selectedProfessional)
                            }
                        >
                            Back to Details
                        </button>
                        <div className="professional-edit-form">
                            <form onSubmit={handleEditSubmit}>
                                <label>
                                    Name:
                                    <input
                                        type="text"
                                        name="name"
                                        value={editFormData.name}
                                        onChange={handleEditFormChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Father's Name:
                                    <input
                                        type="text"
                                        name="fatherName"
                                        value={
                                            editFormData.fatherName || ""
                                        }
                                        onChange={handleEditFormChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Grandfather's Name:
                                    <input
                                        type="text"
                                        name="grandfatherName"
                                        value={
                                            editFormData.grandfatherName ||
                                            ""
                                        }
                                        onChange={handleEditFormChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Specialty:
                                    <input
                                        type="text"
                                        name="speciality"
                                        value={
                                            editFormData.speciality || ""
                                        }
                                        onChange={handleEditFormChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Phone Number:
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        value={
                                            editFormData.phoneNumber || ""
                                        }
                                        onChange={handleEditFormChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Address:
                                    <input
                                        type="text"
                                        name="address"
                                        value={editFormData.address || ""}
                                        onChange={handleEditFormChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Date of Birth:
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={
                                            editFormData.dateOfBirth || ""
                                        }
                                        onChange={handleEditFormChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Gender:
                                    <select
                                        name="gender"
                                        value={editFormData.gender || ""}
                                        onChange={handleEditFormChange}
                                        required
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">
                                            Female
                                        </option>
                                        <option value="other">Other</option>
                                    </select>
                                </label>
                                <label>
                                    Years of Experience:
                                    <input
                                        type="number"
                                        name="yearsOfExperience"
                                        value={
                                            editFormData.yearsOfExperience ||
                                            ""
                                        }
                                        onChange={handleEditFormChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Qualification:
                                    <input
                                        type="text"
                                        name="qualification"
                                        value={
                                            editFormData.qualification || ""
                                        }
                                        onChange={handleEditFormChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Bio:
                                    <textarea
                                        name="bio"
                                        value={editFormData.bio || ""}
                                        onChange={handleEditFormChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Languages Spoken:
                                    <input
                                        type="text"
                                        name="languagesSpoken"
                                        value={
                                            editFormData.languagesSpoken ||
                                            ""
                                        }
                                        onChange={handleEditFormChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Working Hours:
                                    <input
                                        type="text"
                                        name="workingHours"
                                        value={
                                            editFormData.workingHours || ""
                                        }
                                        onChange={handleEditFormChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Status:
                                    <select
                                        name="status"
                                        value={editFormData.status || ""}
                                        onChange={handleEditFormChange}
                                        required
                                    >
                                        <option value="active">
                                            Active
                                        </option>
                                        <option value="suspended">
                                            Suspended
                                        </option>
                                        <option value="terminated">
                                            Terminated
                                        </option>
                                    </select>
                                </label>
                                <button type="submit">
                                    Update Professional
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                 

                    <div class="detail-container">
                    <div class="header">
                        <button class="back-button" onClick={()=>handleBackToList}>Back</button>
                        <h2 class="population-name"><span>{`${selectedProfessional.user?.name} ${selectedProfessional.user?.fatherName} ${selectedProfessional.user?.grandfatherName}`}</span></h2>
                        <div class="header-actions">
                            <button class="generate-report" onClick={()=>handleEdit(selectedProfessional)}>Edit</button>
                            <button class="run-prediction" onClick={()=>handleRemove(selectedProfessional._id)}>Remove</button>
                        </div>
                    </div>
                
                    <div class="details-grid">
                        <div class="detail-item">
                            <strong>Specialty:</strong>{" "}
                            {selectedProfessional.speciality}
                        </div>
                        <div class="detail-item">
                            <strong>Phone Number:</strong>{" "}
                            {selectedProfessional.user?.phoneNumber}
                        </div>
                        <div class="detail-item">
                            <strong>Address:</strong>{" "}
                            {selectedProfessional.user?.address}
                        </div>
                        <div class="detail-item">
                           <strong>Age:</strong>{" "}
                           {calculateAge(
                  selectedProfessional.user?.dateOfBirth
              )}
                        </div>
                        <div class="detail-item">
                            <strong>Gender</strong>
                            <p> {selectedProfessional.user?.gender}</p>
                        </div>
                        <div class="detail-item">
                            <strong>Years of Experience:</strong>{" "}
                            <p>{selectedProfessional.yearsOfExperience}</p>
                        </div>
                        <div class="detail-item">
                          <strong>Qualifications:</strong>{" "}   
                          <p>{selectedProfessional.qualification} </p>
                        </div>
                        <div class="detail-item">
                            <strong>Department: </strong>{" "}
                            <p>{selectedProfessional.department}</p>
                        </div>
                        <div class="detail-item">
                            <strong>Status</strong>
                            <p class="status-active">{selectedProfessional.status}</p>
                        </div>
                    </div>
                </div>


                //     <div className="professional-details professional-card">
                //         <h3>Professional Details:</h3>
                //         <button
                //             className="back-button"
                //             onClick={handleBackToList}
                //         >
                //             Back to List
                //         </button>
                //         <h2 className="professional-name">
                //             Name:{" "}
                //             <span>{`${selectedProfessional.user?.name} ${selectedProfessional.user?.fatherName} ${selectedProfessional.user?.grandfatherName}`}</span>
                //         </h2>
                //         <div className="professional-info-grid">
                //             <p>
                //                 <strong>Specialty:</strong>{" "}
                //                 {selectedProfessional.speciality}
                //             </p>
                //             <p>
                //                 <strong>Phone Number:</strong>{" "}
                //                 {selectedProfessional.user?.phoneNumber}
                //             </p>
                //             <p>
                //                 <strong>Address:</strong>{" "}
                //                 {selectedProfessional.user?.address}
                //             </p>
                //             <p>
                //                 <strong>Age:</strong>{" "}
                //                 {calculateAge(
                //                     selectedProfessional.user?.dateOfBirth
                //                 )}
                //             </p>
                //             <p>
                //                 <strong>Gender:</strong>{" "}
                //                 {selectedProfessional.user?.gender}
                //             </p>
                //             <p>
                //                 <strong>Years of Experience:</strong>{" "}
                //                 {selectedProfessional.yearsOfExperience}
                //             </p>
                //             <p>
                //                 <strong>Qualifications:</strong>{" "}
                //                 {selectedProfessional.qualification}
                //             </p>
                //             <p>
                //                 <strong>Department: </strong>{" "}
                //                 {selectedProfessional.department}
                //             </p>
                //             <p>
                //                 <strong>Bio:</strong> {selectedProfessional.bio}
                //             </p>
                //             <p>
                //                 <strong>Languages:</strong>{" "}
                //                 {selectedProfessional.languagesSpoken.join(
                //                     ", "
                //                 )}
                //             </p>
                //             <p>
                //                 <strong>Working Hours:</strong>{" "}
                //                 {selectedProfessional.workingHours}
                //             </p>
                //         </div>
                //         <div className="status-wrapper">
                //             <span
                //                 className={`status-badge ${selectedProfessional.status}`}
                //             >
                //                 {selectedProfessional.status}
                //             </span>
                //         </div>
                //         <div className="professional-actions">
                //             <button
                //                 className="btn btn-edit"
                //                 onClick={() => handleEdit(selectedProfessional)}
                //             >
                //                 Edit
                //             </button>
                //             <button
                //                 className="btn btn-remove"
                //                 onClick={() =>
                //                     handleRemove(selectedProfessional._id)
                //                 }
                //             >
                //                 Remove
                //             </button>
                //         </div>
                //     </div>




                )
            ) : (
                <div>
                    <h1>Professional List</h1>

                    {/* Search and Filter Section */}
                    <div className="search-filter-container">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                            <option value="terminated">Terminated</option>
                        </select>

                        <select
                            value={filterSpeciality}
                            onChange={(e) => setFilterSpeciality(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">All Specialties</option>
                            <option value="MD">MD</option>
                            <option value="Psychiatry">Psychiatry</option>
                            <option value="Pediatrics">Pediatrics</option>
                        </select>
                    </div>

                    {/* <ul className="professionals-list">


            {/* Table */}
            <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label="patient table">
                    <TableHead>
                        <TableRow>

                        <TableCell>No</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Fathers Name</TableCell>
                        <TableCell>GrandFather Name</TableCell>
                        <TableCell>Phone Number</TableCell>
                        <TableCell>Patient Type</TableCell>
                        <TableCell>Gender</TableCell>
                        <TableCell>Address</TableCell>
                        {/* <TableCell>Condition</TableCell> */}
                        
                        <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredProfessionals.map((professional) => (
                        <TableRow key={professional}>

                            <TableCell>{professional._id}</TableCell>
                            <TableCell>{professional.user?.name}</TableCell>
                            <TableCell>{professional.user?.fatherName}</TableCell>
                            <TableCell>{professional.user?.grandfatherName}</TableCell>
                            <TableCell>{professional.user?.phoneNumber}</TableCell>
                            {/* <TableCell>{patient.patientType}</TableCell> */}
                            <TableCell>{professional.user?.gender}</TableCell> 
                            <TableCell>{professional.user?.address}</TableCell> 
                            

                            {/* <TableCell>
                            <span style={{ ...styles.statusBadge, backgroundColor: row.statusColor }}>
                                {row.status}
                            </span>
                            </TableCell> */}
                            <TableCell>
                            <MoreHorizIcon onClick={()=> handleDetails(professional)}/>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </TableContainer>

                </div>
            )}
        </div>
    );
};
export default ProfessionalsList;
