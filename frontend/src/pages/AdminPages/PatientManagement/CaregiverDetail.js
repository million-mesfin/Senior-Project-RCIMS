import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../Styling/AdminPageStyles/CareGiverDetails.css";
function CaregiverDetail({ patientId, onBack }) {
  const [caregiver, setCaregiver] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    relationshipToPatient: "",
    gender: "",
    address: "",
    officialIdNumber: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true); // Loading state
  const [errorMessage, setErrorMessage] = useState(""); // Error message state

  useEffect(() => {
    const fetchCaregiver = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/caregiver/get-caregiver-by-patient-id/${patientId}`);
        if (response.data.caregiver) {
          setCaregiver(response.data.caregiver);
          setFormData(response.data.caregiver);
        } else {
          setErrorMessage("Caregiver not found."); // Set error message if no caregiver is found
        }
      } catch (error) {
        console.error("Error fetching caregiver:", error);
        setErrorMessage("Error fetching caregiver."); // Set error message on fetch error
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchCaregiver();
  }, [patientId]);

  const handleChange = (input) => (e) => {
    setFormData({ ...formData, [input]: e.target.value });
  };

  const validateForm = () => {
    const formErrors = {};
    const phoneNumberPattern = /^[0-9]{10}$/;

    if (!formData.fullName) formErrors.fullName = "Full Name is required";
    if (!formData.phoneNumber) {
      formErrors.phoneNumber = "Phone Number is required";
    } else if (!phoneNumberPattern.test(formData.phoneNumber)) {
      formErrors.phoneNumber = "Phone Number must be 10 digits";
    }
    if (!formData.relationshipToPatient) formErrors.relationshipToPatient = "Relationship to Patient is required";
    if (!formData.gender) formErrors.gender = "Gender is required";
    if (!formData.address) formErrors.address = "Address is required";
    if (!formData.officialIdNumber) formErrors.officialIdNumber = "Official ID Number is required";

    return formErrors;
  };

  const handleUpdate = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      try {
        const response = await axios.put(`http://localhost:5000/api/caregiver/update-caregiver/${caregiver._id}`, formData);
        alert(response.data.message);
        setCaregiver(response.data.caregiver);
      } catch (error) {
        console.error("Error updating caregiver:", error);
      }
    } else {
      setErrors(formErrors);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this caregiver?");
    if (confirmDelete) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/caregiver/delete-caregiver/${caregiver._id}`);
        alert(response.data.message);
        // Optionally, redirect or perform another action after deletion
      } catch (error) {
        console.error("Error deleting caregiver:", error);
      }
    }
  };

  if (loading) return <div>Loading caregiver details...</div>; // Show loading message while fetching

  if (errorMessage) return <div>{errorMessage}</div>; // Show error message if caregiver is not found

  return (
    <div>
      {/* Back button at the top */}
      <button type="button" onClick={onBack} className="back-button">
        Back
      </button>

      <h2>Caregiver Details</h2>
      <form>
        <div className="form-group">
          <label>Full Name:</label>
          <input type="text" value={formData.fullName} onChange={handleChange("fullName")} />
          {errors.fullName && <span className="error">{errors.fullName}</span>}
        </div>

        <div className="form-group">
          <label>Phone Number:</label>
          <input type="text" value={formData.phoneNumber} onChange={handleChange("phoneNumber")} />
          {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
        </div>

        <div className="form-group">
          <label>Relationship to Patient:</label>
          <input type="text" value={formData.relationshipToPatient} onChange={handleChange("relationshipToPatient")} />
          {errors.relationshipToPatient && <span className="error">{errors.relationshipToPatient}</span>}
        </div>

        <div className="form-group">
          <label>Gender:</label>
          <select value={formData.gender} onChange={handleChange("gender")}>
            <option value="" disabled>Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && <span className="error">{errors.gender}</span>}
        </div>

        <div className="form-group">
          <label>Address:</label>
          <input type="text" value={formData.address} onChange={handleChange("address")} />
          {errors.address && <span className="error">{errors.address}</span>}
        </div>

        <div className="form-group">
          <label>Official ID Number:</label>
          <input type="text" value={formData.officialIdNumber} onChange={handleChange("officialIdNumber")} />
          {errors.officialIdNumber && <span className="error">{errors.officialIdNumber}</span>}
        </div>

        <button type="button" onClick={handleUpdate}>
          Update Caregiver
        </button>
        <button type="button" onClick={handleDelete}>
          Delete Caregiver
        </button>
      </form>
    </div>
  );
}

export default CaregiverDetail;
