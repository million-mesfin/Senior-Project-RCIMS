import React, { useState } from "react";

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState(""); // Track feedback input
  const [submittedMessage, setSubmittedMessage] = useState(""); // Track submission message

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (feedback.trim() === "") {
      alert("Feedback cannot be empty");
      return;
    }

    // You can handle sending the feedback to a server here
    alert("Thank you for your feedback!");

    setSubmittedMessage("Your feedback has been submitted. Thank you!");
    setFeedback(""); // Clear the feedback text after submission
  };

  // Handle input change for feedback text
  const handleInputChange = (e) => {
    setFeedback(e.target.value);
  };

  return (
    <div className="feedback-page">
      <h2>Feedback Page</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="feedback">Your Feedback:</label>
        <textarea
          id="feedback"
          name="feedback"
          value={feedback}
          onChange={handleInputChange}
          placeholder="Please share your feedback here..."
          rows="5"
          cols="40"
          required
        />
        <br />
        <button type="submit">Submit Feedback</button>
      </form>
      {/* Display submission message below the form */}
      {submittedMessage && <p>{submittedMessage}</p>}
    </div>
  );
};

export default FeedbackPage;
