import "./PatientPagesStyles/GeneralReport.css"

const GeneralReport = () =>{
    return (
        <>
            <div class="general-report-page">
  <h2>Request General Report</h2>

  <form class="report-form" action="/submit-report-request" method="POST" enctype="multipart/form-data">
    
    {/* <!-- Report Type --> */}
    <div class="form-group">
      <label for="report-type">Report Type</label>
      <select id="report-type" name="report-type" required>
        <option value="medical-history">Medical History</option>
        <option value="diagnosis-report">Diagnosis Report</option>
        <option value="lab-results">Lab Results</option>
        <option value="imaging-report">Imaging Report</option>
        <option value="billing-summary">Billing Summary</option>
      </select>
    </div>

    {/* <!-- Date Range --> */}
    <div class="form-group">
      <label for="start-date">Start Date</label>
      <input type="date" id="start-date" name="start-date" required/>
    </div>

    <div class="form-group">
      <label for="end-date">End Date</label>
      <input type="date" id="end-date" name="end-date" required/>
    </div>

    {/* <!-- Additional Notes --> */}
    <div class="form-group">
      <label for="additional-notes">Additional Notes</label>
      <textarea id="additional-notes" name="additional-notes" rows="4" placeholder="Provide any extra details if necessary"></textarea>
    </div>

    {/* <!-- Upload Documents --> */}
    <div class="form-group" id = 'uploadDoc'>
      <label for="upload-documents">Upload Supporting Documents</label>
      <input type="file" id="upload-documents" name="upload-documents" multiple />
    </div>

    {/* <!-- Submit Button --> */}
    <div class="form-group">
      <button type="submit" class="submit-btn">Submit Request</button>
    </div>

  </form>
</div>

        </>
    );
}

export default GeneralReport