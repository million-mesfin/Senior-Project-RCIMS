import React, { useState } from "react";
import axios from "axios";
//import "./PatientProgress.css"; // Optional: Add your styles here

const PatientProgressForm = ({ patientId, onSubmitSuccess, onGoBack }) => {
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    bmi: "",
    bloodPressure: "",
    heartRate: "",
    respiratoryRate: "",
    spo2: "",
    bloodglucose: "",
    CBC: "",
    frequencyOfUse: "",
    quantityOfUse: "",
    numberOfCravings: "",
    asiScore: "",
    asiCategory: "",
    ALT: "",
    AST: "",
    ALP: "",
    serumCreatinine: "",
    urinalysis: "",
  });

  const [currentStep, setCurrentStep] = useState(1); // Track the current step of the form
  const [error, setError] = useState(null);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/patient-progress", // Adjust API endpoint as needed
        {
          ...formData,
          patient: patientId, // Pass the patientId along with form data
        }
      );
      alert("Progress report submitted successfully!");
      if (onSubmitSuccess) onSubmitSuccess(); // Call the function if provided
      setFormData({
        height: "",
        weight: "",
        bmi: "",
        bloodPressure: "",
        heartRate: "",
        respiratoryRate: "",
        spo2: "",
        bloodglucose: "",
        CBC: "",
        frequencyOfUse: "",
        quantityOfUse: "",
        numberOfCravings: "",
        asiScore: "",
        asiCategory: "",
        ALT: "",
        AST: "",
        ALP: "",
        serumCreatinine: "",
        urinalysis: "",
      });
      setCurrentStep(1); // Reset to step 1 after submission
    } catch (error) {
      console.error("Error submitting progress report:", error);
      setError("Error submitting progress report.");
    }
  };

  // Render the first step of the form
  const renderStep1 = () => (
    <div className="form-step-1">
      <label>Height (cm):</label>
      <input
        type="number"
        name="height"
        value={formData.height}
        onChange={handleInputChange}
        required
      />
      <label>Weight (kg):</label>
      <input
        type="number"
        name="weight"
        value={formData.weight}
        onChange={handleInputChange}
        required
      />
      <label>BMI:</label>
      <input
        type="number"
        name="bmi"
        value={formData.bmi}
        onChange={handleInputChange}
        required
      />
      <label>Blood Pressure (mmHg):</label>
      <input
        type="number"
        name="bloodPressure"
        value={formData.bloodPressure}
        onChange={handleInputChange}
        required
      />
      <label>Heart Rate (bpm):</label>
      <input
        type="number"
        name="heartRate"
        value={formData.heartRate}
        onChange={handleInputChange}
        required
      />
      <label>Respiratory Rate (breaths/min):</label>
      <input
        type="number"
        name="respiratoryRate"
        value={formData.respiratoryRate}
        onChange={handleInputChange}
        required
      />
      <label>SpO2 (%):</label>
      <input
        type="number"
        name="spo2"
        value={formData.spo2}
        onChange={handleInputChange}
        required
      />
      {/* Back button to navigate back to the details page */}
      <button type="button" onClick={onGoBack}>
        Back to Details
      </button>
      <button type="button" onClick={() => setCurrentStep(2)}>
        Next
      </button>
    </div>
  );

  // Render the second step of the form
  const renderStep2 = () => (
    <div className="form-step-2">
      <label>Blood Glucose (mg/dL):</label>
      <input
        type="number"
        name="bloodglucose"
        value={formData.bloodglucose}
        onChange={handleInputChange}
        required
      />
      <label>CBC (Complete Blood Count):</label>
      <input
        type="text"
        name="CBC"
        value={formData.CBC}
        onChange={handleInputChange}
        required
      />
      <label>Frequency of Use (times/week):</label>
      <input
        type="text"
        name="frequencyOfUse"
        value={formData.frequencyOfUse}
        onChange={handleInputChange}
        required
      />
      <label>Quantity of Use (grams):</label>
      <input
        type="number"
        name="quantityOfUse"
        value={formData.quantityOfUse}
        onChange={handleInputChange}
        required
      />
      <label>Number of Cravings (per week):</label>
      <input
        type="number"
        name="numberOfCravings"
        value={formData.numberOfCravings}
        onChange={handleInputChange}
        required
      />
      <label>ASI Score:</label>
      <input
        type="number"
        name="asiScore"
        value={formData.asiScore}
        onChange={handleInputChange}
        required
      />
      <label>ASI Category:</label>
      <input
        type="text"
        name="asiCategory"
        value={formData.asiCategory}
        onChange={handleInputChange}
        required
      />
      <label>ALT (U/L):</label>
      <input
        type="number"
        name="ALT"
        value={formData.ALT}
        onChange={handleInputChange}
        required
      />
      <label>AST (U/L):</label>
      <input
        type="number"
        name="AST"
        value={formData.AST}
        onChange={handleInputChange}
        required
      />
      <label>ALP (U/L):</label>
      <input
        type="number"
        name="ALP"
        value={formData.ALP}
        onChange={handleInputChange}
        required
      />
      <label>Serum Creatinine (mg/dL):</label>
      <input
        type="number"
        name="serumCreatinine"
        value={formData.serumCreatinine}
        onChange={handleInputChange}
        required
      />
      <label>Urinalysis Results:</label>
      <input
        type="text"
        name="urinalysis"
        value={formData.urinalysis}
        onChange={handleInputChange}
        required
      />
      <button type="button" onClick={() => setCurrentStep(1)}>
        Back
      </button>
      <button type="submit">Submit Report</button>
    </div>
  );

  return (
    <div className="patient-progress-form">
      <h2>Submit Patient Progress Report</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        {currentStep === 1 ? renderStep1() : renderStep2()}
      </form>
    </div>
  );
};

export default PatientProgressForm;
