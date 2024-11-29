import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

  };

 
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      "http://localhost:8800/api/child/signin",
      formData,
      { withCredentials: true }
    );
    
    console.log("Response data: ", response.data); // Debugging line

    setMessage(response.data.message); // This assumes `message` exists in the response

    // Redirect to profile with child data
    navigate("/profile", { state: { child: response.data.child } });
  } catch (error) {
    if (error.response) {
      console.error("Error response: ", error.response); // Debugging line
      setMessage(error.response.data.message || "An error occurred.");
    } else {
      setMessage("Network error or server is down.");
    }
  }
};




  return (
    <div>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Child's Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Sign In</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SignIn;

