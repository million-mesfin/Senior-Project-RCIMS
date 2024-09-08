import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Styling/AdminPageStyles/ProfessionalManagementStyles/ProfessionalsList.css";

const ProfessionalsList = () => {
    const [professionals, setProfessionals] = useState([]);
    const [selectedProfessional, setSelectedProfessional] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProfessionals();
    }, []);

    const fetchProfessionals = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/admin/professionals/get-professionals"
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
            name: professional.user?.name || '',
            fatherName: professional.user?.fatherName || '',
            grandfatherName: professional.user?.grandfatherName || '',
            speciality: professional.speciality || '',
            phoneNumber: professional.user?.phoneNumber || '',
            address: professional.user?.address || '',
            dateOfBirth: professional.user?.dateOfBirth ? new Date(professional.user.dateOfBirth).toISOString().split('T')[0] : '',
            gender: professional.user?.gender || '',
            yearsOfExperience: professional.yearsOfExperience || '',
            qualification: professional.qualification || '',
            bio: professional.bio || '',
            languagesSpoken: professional.languagesSpoken ? professional.languagesSpoken.join(', ') : '',
            workingHours: professional.workingHours || '',
            status: professional.status || '',
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
                `http://localhost:5000/api/admin/professionals/update-professional/${editFormData._id}`,
                editFormData
            );
            if (response.status === 200) {
                alert("Professional updated successfully");

                const updatedProfessional = response.data.professional;
                const updatedUser = response.data.user;
                const combinedData = {
                    ...updatedProfessional,
                    user: updatedUser
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
                await axios.delete(
                    `http://localhost:5000/api/admin/professionals/delete-professional/${professionalId}`
                );
                setProfessionals(
                    professionals.filter((prof) => prof._id !== professionalId)
                );
                setSelectedProfessional(null);
            } catch (error) {
                console.error("Error removing professional:", error);
                setError(`Failed to remove professional. ${error.message}`);
            }
        }
    };

    // A fuction to calculate the age of the professional
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
            <h1>Professionals List</h1>
            {selectedProfessional ? (
                isEditing ? (
                    <div className="professional-edit-form">
                        <button onClick={() => handleBackToDetails(selectedProfessional)}>
                            Back to Details
                        </button>
                        <h2>Edit Professional</h2>
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
                                    value={editFormData.fatherName || ""}
                                    onChange={handleEditFormChange}
                                    required
                                />
                            </label>
                            <label>
                                Grandfather's Name:
                                <input
                                    type="text"
                                    name="grandfatherName"
                                    value={editFormData.grandfatherName || ""}
                                    onChange={handleEditFormChange}
                                    required
                                />
                            </label>
                            <label>
                                Specialty:
                                <input
                                    type="text"
                                    name="speciality"
                                    value={editFormData.speciality || ""}
                                    onChange={handleEditFormChange}
                                    required
                                />
                            </label>
                            <label>
                                Phone Number:
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={editFormData.phoneNumber || ""}
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
                                    value={editFormData.dateOfBirth || ""}
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
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </label>
                            <label>
                                Years of Experience:
                                <input
                                    type="number"
                                    name="yearsOfExperience"
                                    value={editFormData.yearsOfExperience || ""}
                                    onChange={handleEditFormChange}
                                    required
                                />
                            </label>
                            <label>
                                Qualification:
                                <input
                                    type="text"
                                    name="qualification"
                                    value={editFormData.qualification || ""}
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
                                    value={editFormData.languagesSpoken || ""}
                                    onChange={handleEditFormChange}
                                    required
                                />
                            </label>
                            <label>
                                Working Hours:
                                <input
                                    type="text"
                                    name="workingHours"
                                    value={editFormData.workingHours || ""}
                                    onChange={handleEditFormChange}
                                    required
                                />
                            </label>
                            <label>
                                Status:
                                <select name="status" value={editFormData.status || ""} onChange={handleEditFormChange} required>
                                    <option value="active">Active</option>
                                    <option value="suspended">Suspended</option>
                                    <option value="terminated">Terminated</option>
                                </select>
                            </label>
                            <button type="submit">Update Professional</button>
                        </form>
                    </div>
                ) : (
                    <div className="professional-details">
                        <button onClick={handleBackToList}>Back to List</button>
                        <h2>
                            {selectedProfessional.user?.name +
                                " " +
                                selectedProfessional.user?.fatherName +
                                " " +
                                selectedProfessional.user?.grandfatherName}
                        </h2>
                        <p>Specialty: {selectedProfessional.speciality}</p>
                        <p>
                            Phone Number:{" "}
                            {selectedProfessional.user?.phoneNumber}
                        </p>
                        <p>Address: {selectedProfessional.user?.address}</p>
                        <p>
                            Age:{" "}
                            {calculateAge(
                                selectedProfessional.user?.dateOfBirth
                            )}
                        </p>
                        <p>Gender: {selectedProfessional.user?.gender}</p>
                        <p>
                            Years of Experience:{" "}
                            {selectedProfessional.yearsOfExperience}
                        </p>
                        <p>
                            Qualifications: {selectedProfessional.qualification}
                        </p>
                        <p>Bio: {selectedProfessional.bio}</p>
                        <p>
                            Languages:{" "}
                            {selectedProfessional.languagesSpoken.join(", ")}
                        </p>
                        <p>
                            Working Hours: {selectedProfessional.workingHours}
                        </p>
                        <p>Status: {selectedProfessional.status}</p>
                        {/* Add more details as needed */}
                        <button
                            className="btn btn-edit"
                            onClick={() => handleEdit(selectedProfessional)}
                        >
                            Edit
                        </button>
                        <button
                            className="btn btn-remove"
                            onClick={() =>
                                handleRemove(selectedProfessional._id)
                            }
                        >
                            Remove
                        </button>
                    </div>
                )
            ) : Array.isArray(professionals) && professionals.length > 0 ? (
                <ul className="professionals-list">
                    {professionals.map((professional) => (
                        <li
                            key={professional._id}
                            className="professional-item"
                        >
                            <div className="professional-info">
                                <h2>
                                    {professional.user?.name +
                                        " " +
                                        professional.user?.fatherName +
                                        " " +
                                        professional.user?.grandfatherName}
                                </h2>
                                <p>Specialty: {professional.speciality}</p>
                                <p>
                                    Phone Number:{" "}
                                    {professional.user?.phoneNumber}
                                </p>
                            </div>
                            <div className="professional-actions">
                                <button
                                    className="btn btn-details"
                                    onClick={() => handleDetails(professional)}
                                >
                                    Details
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No professionals found.</p>
            )}
        </div>
    );
};
export default ProfessionalsList;
