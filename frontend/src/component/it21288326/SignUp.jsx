import React, { useState } from "react";
import axios from "axios";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
  
    password: "",
    parentEmail: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8800/api/child/signup", formData);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    // <div>
    //   <h1>Sign Up</h1>
    //   <form onSubmit={handleSubmit}>
    //     <input
    //       type="text"
    //       name="name"
    //       placeholder="Child's Name"
    //       value={formData.name}
    //       onChange={handleChange}
    //       required
    //     />

    //     <select name="gender" value={formData.gender} onChange={handleChange}>
    //       <option value="Male">Male</option>
    //       <option value="Female">Female</option>
    //       <option value="Other">Other</option>
    //     </select>

    //     <input
    //       type="number"
    //       name="age"
    //       placeholder="Age"
    //       value={formData.age}
    //       onChange={handleChange}
    //       required
    //     />
    //     <input
    //       type="password"
    //       name="password"
    //       placeholder="Password"
    //       value={formData.password}
    //       onChange={handleChange}
    //       required
    //     />
    //     <input
    //       type="email"
    //       name="parentEmail"
    //       placeholder="Parent Email"
    //       value={formData.parentEmail}
    //       onChange={handleChange}
    //       required
    //     />
    //     <button type="submit">Sign Up</button>
    //   </form>
    //   {message && <p>{message}</p>}
    // </div>

<div className="signin-page">
    <div className="container mt-5">
  <div className="row justify-content-center" style={{ marginTop: '80px',marginBottom:'50px' }}>
    <div className="col-md-6">
      <div className="card shadow">
        <div className="card-header text-center bg-white">
          <img
            src="/assets/it21288326/pulsemindlogo.jpg"
            alt="Sign Up Illustration"
            className="img-fluid"
          />
        </div>
        <div className="card-body">
          <h1 className="text-center mb-4" style={{ fontSize: '40px', fontWeight: '800' }}>
            Sign Up
          </h1>
          <form onSubmit={handleSubmit} style={{ fontSize: '25px', fontWeight: '700' }}>
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
                style={{ fontSize: '18px' }}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="gender" className="form-label">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                className="form-control"
                value={formData.gender}
                onChange={handleChange}
                style={{ fontSize: '18px' }}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="age" className="form-label">
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                className="form-control"
                placeholder="Enter age"
                value={formData.age}
                onChange={handleChange}
                required
                style={{ fontSize: '18px' }}
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
                style={{ fontSize: '18px' }}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="parentEmail" className="form-label">
                Parent Email
              </label>
              <input
                type="email"
                id="parentEmail"
                name="parentEmail"
                className="form-control"
                placeholder="Enter parent email"
                value={formData.parentEmail}
                onChange={handleChange}
                required
                style={{ fontSize: '18px' }}
              />
            </div>
<br></br>
            <button
              type="submit"
              className="btn w-100"
              style={{ fontSize: '25px', backgroundColor: '#4083A8', color: 'white', height: '50px' }}
            >
              Sign Up
            </button>
          </form>
          {message && <p className="text-success text-center mt-3">{message}</p>}
        </div>
      </div>
    </div>
  </div>
</div>
</div>

  );
};

export default SignUp;
