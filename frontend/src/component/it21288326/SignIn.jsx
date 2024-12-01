import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import './Signin.css'
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
    navigate("../Home", { state: { child: response.data.child } });
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
    <div className="signin-page">
    <div className="container mt-5" >
    <div className="row justify-content-center" >
      <div className="col-md-6">
        <div className="card shadow">
          <div className="text-center bg-white">
            <img
              src="/assets/it21288326/pulsemindlogo.jpg" // Replace with your image path
              alt="Sign In Illustration"
              className="img-fluid"
               />
          </div>
          <div className="card-body" >
            <h1 className="text-center mb-4" style={{fontSize:'40px', fontWeight:'800'}}>Sign In</h1>
            <form onSubmit={handleSubmit} style={{fontSize:'25px', fontWeight:'700'}}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Child's Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{fontSize:'18px'}}
                />
              </div>
             
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{fontSize:'18px'}}
                />
              </div>
              <br></br>
              <button type="submit" className="btn w-100" style={{fontSize:'25px', backgroundColor:'#4083A8', color:'white',height:'50px'}}>
                Sign In
              </button>
            </form>
            {message && <p className="text-success text-center mt-3">{message}</p>}
            <div className="text-center mt-3">
                <p style={{ fontSize: "18px" }}>
                  Don't have an account?{" "}
                  <Link to="/sign-up" style={{ color: "#4083A8", fontWeight: "700" }}>
                    Sign Up
                  </Link>
                </p>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
  );
};

export default SignIn;

