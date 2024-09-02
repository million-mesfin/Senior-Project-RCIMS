import React, { useState } from 'react';
import '../../Styling/AdminPageStyles/AddProfessional.css';
import axios from 'axios';

function AddProfessional() {
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    grandfatherName: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    qualification: '',
    speciality: '',
    licenseNumber: '',
    yearsOfExperience: '',
    department: '',
    bio: '',
    languagesSpoken: '',
    workingHours: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // First, check if a user with this phone number already exists
      const checkResponse = await axios.get(`http://localhost:5000/api/admin/professionals/check-phone/${formData.phoneNumber}`);
      
      if (checkResponse.data.exists) {
        alert("A user with this phone number already exists. Please use a different phone number.");
        return;
      }

      // If the phone number is unique, proceed with creating the professional
      const professionalData = {
        ...formData,
        password: 'password123', // Set default password
        role: 'professional', // Add professional role
      };
      await axios.post('http://localhost:5000/api/admin/professionals/add-professional', professionalData);
      alert('Professional created successfully');
      // Optionally, clear the form or redirect the user
      setFormData({
        name: '',
        fatherName: '',
        grandfatherName: '',
        phoneNumber: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        qualification: '',
        speciality: '',
        licenseNumber: '',
        yearsOfExperience: '',
        department: '',
        bio: '',
        languagesSpoken: '',
        workingHours: '',
      });
      
    } catch (error) {
      console.error('Error creating professional:', error);
      alert(`Error creating professional: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="add-professional-container">
      <h1>Add New Professional</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="fatherName">Father's Name</label>
          <input type="text" id="fatherName" name="fatherName" value={formData.fatherName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="grandfatherName">Grandfather's Name</label>
          <input type="text" id="grandfatherName" name="grandfatherName" value={formData.grandfatherName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="" disabled>Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="qualification">Qualification</label>
          <input type="text" id="qualification" name="qualification" value={formData.qualification} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="speciality">Speciality</label>
          <input type="text" id="speciality" name="speciality" value={formData.speciality} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="licenseNumber">License Number</label>
          <input type="text" id="licenseNumber" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="yearsOfExperience">Years of Experience</label>
          <input type="number" id="yearsOfExperience" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="department">Department</label>
          <input type="text" id="department" name="department" value={formData.department} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} required></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="languagesSpoken">Languages Spoken (comma-separated)</label>
          <input type="text" id="languagesSpoken" name="languagesSpoken" value={formData.languagesSpoken} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="workingHours">Working Hours</label>
          <input type="text" id="workingHours" name="workingHours" value={formData.workingHours} onChange={handleChange} required />
        </div>
        <button type="submit" className="submit-btn">Add Professional</button>
      </form>
    </div>
  );
}

export default AddProfessional;
