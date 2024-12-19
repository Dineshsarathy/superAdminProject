import React, { useState, useEffect } from "react"; // Ensure 'React' is imported explicitly
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../Component/Header";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams(); // Extract token from the URL
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Function to handle the password reset
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error and success states
    setError(null);
    setSuccessMessage("");

    // Validation checks
    if (!newPassword || !confirmPassword) {
      setError("Both fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // API request to reset the password
      await axios.post(`http://localhost:8000/api/auth/reset-password/${token}`, {
        newPassword,
      });

      setSuccessMessage("Password reset successfully.");
      setTimeout(() => navigate("/login"), 2000); // Redirect to login page after 2 seconds
    } catch (err) {
      setError(err.response?.data?.message || "Error resetting password. Please try again.");
    }
  };

  return (
    <div style={{ display: "block", width: "100%" }}>
      <Header />
      <div className="reset-password-container">
        <h2>Reset Password</h2>
        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
          </div>
          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
}
