import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Styling/AdminPageStyles/ProfessionalManagementStyles/ProfessionalsList.css";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
import { red } from "@mui/material/colors";

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
                 <div className="header">
                 <ArrowBackIcon onClick={handleBackToDetails(selectedProfessional)} />
                <h2>Edit Professional</h2>
               </div>
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
                    <ArrowBackIcon  onClick={handleBackToList} />
                    <h2 class="professional-name">{`${selectedProfessional.user?.name} ${selectedProfessional.user?.fatherName} ${selectedProfessional.user?.grandfatherName}`}</h2>
                    </div>
              <div class="details">
                    <div className="column1">
                         <div className="detail-item-wrapper">  
                          <div class="detail-item"> 
                              <strong>Specialty</strong>{" "}
                                <p>{selectedProfessional.speciality}</p>
                            </div>
                        </div>
                        <div className="detail-item-wrapper">
                        <div class="detail-item">
                        <strong>Phone Number</strong>{" "}
                            <p>{selectedProfessional.user?.phoneNumber}</p> 
                         </div>
                        </div>

                         <div className="detail-item-wrapper">
                       <div class="detail-item">
                             <strong>Address</strong>{" "}
                           <p>{selectedProfessional.user?.address}</p>  
                     </div>
                         </div>

                       <div className="detail-item-wrapper">
                        <div class="detail-item">
                            <strong>Age</strong>
                          <p>{calculateAge(selectedProfessional.user?.dateOfBirth )}</p> 
                        </div>
                    </div>                        
                    <div className="detail-item-wrapper">
                        <div class="detail-item">
                           <strong>Gender</strong> 
                            <p> {selectedProfessional.user?.gender}</p>
                        </div>
                            </div>
                    </div>

                    <div className="column2">
                     <div className="detail-item-wrapper">
                        <div class="detail-item">
                           <strong>Years of Experience</strong>{" "}
                            <p>{selectedProfessional.yearsOfExperience}</p>
                        </div>
                        </div>
                      <div className="detail-item-wrapper">
                         <div class="detail-item">
                         <strong>Qualifications:</strong>{" "} 
                          <p>{selectedProfessional.qualification} </p>
                        </div>
                        </div>

                        <div className="detail-item-wrapper">  
                          <div class="detail-item">
                          <strong>Department: </strong>{" "}
                            <p>{selectedProfessional.department}</p>
                        </div>
                        </div>

                        <div className="detail-item-wrapper">
                        <div class="detail-item">
                            <strong>Status</strong>
                            <p class="status-active">{selectedProfessional.status}</p>
                        </div>
                        </div>
                    </div>
                 </div>
                 <div class="header-actions">
                            <button class="btn-edit" 
                                   className="w-full flex justify-center bg-gradient-to-r from-cyan-300 to-blue-800  text-gray-100 p-4 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
                         
                            onClick={() => handleEdit(selectedProfessional)}>Edit</button>
                            <button class="btn-remove"                                 className="w-full flex justify-center bg-gradient-to-r from-cyan-300 to-blue-800  text-gray-100 p-4 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
 onClick={() => handleRemove(selectedProfessional._id)}>Remove</button>
                        </div>
                </div>

                )
            ) : (
                <div>
                    {/* <h1>Professional List</h1> */}

                    {/* Search and Filter Section */}
                    {/* <div className="search-filter-container"> */}
                    <div style={styles.header}>
                 <h2 style={{color: "black", margin: 0}}>Professional List</h2>
            <div style={styles.actions}>
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
                    </div>

                       {/* Table */}
            <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label="patient table">
                    <TableHead>
                        <TableRow>

                        <TableCell>No</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Fathers Name</TableCell>
                        {/* <TableCell>GrandFather Name</TableCell> */}
                        <TableCell>Phone Number</TableCell>
                        {/* <TableCell>Patient Type</TableCell> */}
                        <TableCell>Gender</TableCell>
                        <TableCell>Address</TableCell>
                        {/* <TableCell>Condition</TableCell> */}
                        
                        <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredProfessionals.map((professional, index) => (
                        <TableRow key={professional}>

                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{professional.user?.name}</TableCell>
                            <TableCell>{professional.user?.fatherName}</TableCell>
                            {/* <TableCell>{professional.user?.grandfatherName}</TableCell> */}
                            <TableCell>{professional.user?.phoneNumber}</TableCell>
                            {/* <TableCell>{patient.patientType}</TableCell> */}
                            <TableCell>{professional.user?.gender}</TableCell> 
                            <TableCell>{professional.user?.address}</TableCell> 
                            
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

const styles = {
    h2: {
        color: "#333",
    },
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
export default ProfessionalsList;
