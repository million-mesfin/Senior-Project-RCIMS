import "./PatientPagesStyles/medicalHistory.css"

const medicalHistory =() => {
    return (
        <>
        <div class="medical-history-page">
  <h2>Medical History</h2>

  {/* <!-- Section for past appointments --> */}
  <div class="history-section">
    <h3>Past Appointments</h3>
    <div class="history-card">
      <p><strong>Date:</strong> 12th Aug 2023</p>
      <p><strong>Doctor:</strong> Dr. John Doe</p>
      <p><strong>Reason:</strong> Follow-up</p>
      <p><strong>Notes:</strong> Continue medication and follow-up after 1 month.</p>
    </div>

    <div class="history-card">
      <p><strong>Date:</strong> 5th July 2023</p>
      <p><strong>Doctor:</strong> Dr. Jane Smith</p>
      <p><strong>Reason:</strong> Annual Checkup</p>
      <p><strong>Notes:</strong> General health check. Blood pressure slightly elevated.</p>
    </div>
  </div>

  {/* <!-- Section for diagnoses --> */}
  <div class="history-section">
    <h3>Diagnoses</h3>
    <div class="history-card">
      <p><strong>Date:</strong> 5th July 2023</p>
      <p><strong>Diagnosis:</strong> Hypertension</p>
      <p><strong>Doctor:</strong> Dr. Jane Smith</p>
      <p><strong>Treatment:</strong> Prescribed blood pressure medication</p>
    </div>
  </div>

  {/* <!-- Section for medications --> */}
  <div class="history-section">
    <h3>Medications</h3>
    <div class="history-card">
      <p><strong>Medication:</strong> Lisinopril</p>
      <p><strong>Dosage:</strong> 10 mg, once daily</p>
      <p><strong>Prescribed on:</strong> 12th Aug 2023</p>
    </div>
  </div>

  {/* <!-- Section for treatments --> */}
  <div class="history-section">
    <h3>Ongoing Treatments</h3>
    <div class="history-card">
      <p><strong>Treatment:</strong> Physiotherapy for lower back pain</p>
      <p><strong>Start Date:</strong> 10th July 2023</p>
      <p><strong>Therapist:</strong> Sarah Wilson</p>
      <p><strong>Frequency:</strong> Twice a week</p>
    </div>
  </div>
</div>
</>
    );
}


export default medicalHistory