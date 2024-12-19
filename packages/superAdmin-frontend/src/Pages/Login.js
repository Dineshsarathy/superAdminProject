import { useState, } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // State to track "Remember Me" checkbox

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe); // Toggle the Remember Me checkbox
  };
    // Function to handle Forgot Password without navigating to the forgot password page
    const handleForgotPassword = async () => {
      setError("");
      try {
        await axios.post("http://localhost:8000/api/auth/forgot-password", {
          email: formData.email,
        });
        setError("A password reset link has been sent to your email.");
      } catch (err) {
        setError("Error sending reset link. Please try again.");
      }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const { token } = response.data;
      // Save token to localStorage or sessionStorage based on "Remember Me" state
      if (rememberMe) {
        localStorage.setItem("token", token);  // Store in localStorage
      } else {
        sessionStorage.setItem("token", token); // Store in sessionStorage
      }
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="login">
      <div className="login-container">
        <h2>Welcome to The Website Creation</h2>
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="login-props">
          <div className="form-group">
            <label className="remember">
              <input
                className="checkbox"
                type="checkbox"
                checked={rememberMe}
                onChange={handleRememberMeChange}
              />{" "}
              Remember Me
            </label>
          </div>
          <p>
          <h5 onClick={handleForgotPassword}
              style={{cursor: "pointer", color: "blue"}}>
            Forgot Password?</h5>
          </p>
          </div>
          <button className="log-btn" style={{borderRadius:"20px",width:"120px"}} type="submit">Login</button>
        </form>
        
      </div>
    </div>
  );


}
