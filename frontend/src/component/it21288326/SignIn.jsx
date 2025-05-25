// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// import './Signin.css'
// const SignIn = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     password: "",
//   });

//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   };

 
// const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     const response = await axios.post(
//       "http://localhost:8800/api/child/signin",
//       formData,
//       { withCredentials: true }
//     );
    
//     console.log("Response data: ", response.data); // Debugging line

//     setMessage(response.data.message); // This assumes `message` exists in the response

//     // Redirect to profile with child data
//     navigate("../Home", { state: { child: response.data.child } });
//   } catch (error) {
//     if (error.response) {
//       console.error("Error response: ", error.response); // Debugging line
//       setMessage(error.response.data.message || "An error occurred.");
//     } else {
//       setMessage("Network error or server is down.");
//     }
//   }
// };
//  return (
//     <div className="signin-page">
//     <div className="container mt-5" >
//     <div className="row justify-content-center" >
//       <div className="col-md-6">
//         <div className="card shadow">
//           <div className="text-center bg-white">
//             <img
//               src="/assets/it21288326/pulsemindlogo.jpg" 
//               alt="Sign In Illustration"
//               className="img-fluid"
//                />
//           </div>
//           <div className="card-body" >
//             <h1 className="text-center mb-4" style={{fontSize:'40px', fontWeight:'800'}}>Sign In</h1>
//             <form onSubmit={handleSubmit} style={{fontSize:'25px', fontWeight:'700'}}>
//               <div className="mb-3">
//                 <label htmlFor="name" className="form-label">
//                   Child's Name
//                 </label>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   className="form-control"
//                   placeholder="Enter your name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                   style={{fontSize:'18px'}}
//                 />
//               </div>
             
//               <div className="mb-3">
//                 <label htmlFor="password" className="form-label">
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   id="password"
//                   name="password"
//                   className="form-control"
//                   placeholder="Enter your password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                   style={{fontSize:'18px'}}
//                 />
//               </div>
//               <br></br>
//               <button type="submit" className="btn w-100" style={{fontSize:'25px', backgroundColor:'#4083A8', color:'white',height:'50px'}}>
//                 Sign In
//               </button>
//             </form>
//             {message && <p className="text-success text-center mt-3">{message}</p>}
//             <div className="text-center mt-3">
//                 <p style={{ fontSize: "18px" }}>
//                   Don't have an account?{" "}
//                   <Link to="/sign-up" style={{ color: "#4083A8", fontWeight: "700" }}>
//                     Sign Up
//                   </Link>
//                 </p>
//               </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
//   </div>
//   );
// };

// export default SignIn;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import './Signin.css'; // Assuming you have some styles here

const SignIn = () => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({}); // For field-specific and form errors
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Child's name is required.";
    }
    if (!formData.password) { // Password can't be just whitespace
      newErrors.password = "Password is required.";
    }
    // No min length check for password on sign-in usually,
    // as that's a sign-up concern. Backend handles actual validation.
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear specific error when user types
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
    }
    // Clear general message or form error as well
    if (message) setMessage("");
    if (errors.form) setErrors((prevErrors) => ({ ...prevErrors, form: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages
    setErrors({});  // Clear previous errors

    if (!validate()) {
      return; // Stop submission if client-side validation fails
    }

    try {
      const response = await axios.post(
        "http://localhost:8800/api/child/signin", // Make sure this endpoint is correct
        formData,
        { withCredentials: true }
      );

      // Assuming successful login, backend sends a success message and child data
      // setMessage(response.data.message || "Login successful!"); // You can set this if needed, but navigation happens quickly

      // Redirect to Home (or profile) with child data
      // The backend `signIn` controller sends back `child: { id, name, age, gender }`
      navigate("/Home", { state: { child: response.data.child } }); // Corrected path to be absolute

    } catch (error) {
      if (error.response && error.response.data) {
        // Handle specific error messages from the backend
        const backendMessage = error.response.data.message || "An error occurred.";
        // Set as a general form error, or field-specific if backend provides that
        if (error.response.status === 401 || error.response.status === 404) { // Unauthorized or Not Found
          setErrors({ form: backendMessage });
        } else if (error.response.data.errors) { // If backend sends field-specific errors
            setErrors(error.response.data.errors);
        }
         else {
          setErrors({ form: "An unexpected error occurred. Please try again." });
        }
        setMessage(""); // Clear any success message
      } else {
        // Network error or server is down
        setErrors({ form: "Network error or the server might be down. Please try again later." });
        setMessage("");
      }
    }
  };

  return (
    <div className="signin-page">
      <div className="container mt-5">
        <div className="row justify-content-center" style={{ marginTop: '80px', marginBottom: '50px' }}>
          <div className="col-md-6">
            <div className="card shadow">
              <div className="text-center bg-white pt-3"> {/* Added padding top */}
                <img
                  src="/assets/it21288326/pulsemindlogo.jpg"
                  alt="Sign In Illustration"
                  className="img-fluid"
                  style={{ maxHeight: "150px" }} // Constrain logo height
                />
              </div>
              <div className="card-body">
                <h1 className="text-center mb-4" style={{ fontSize: '40px', fontWeight: '800' }}>Sign In</h1>

                {/* Display general form error if any */}
                {errors.form && <p className="alert alert-danger text-center">{errors.form}</p>}
                {/* Display success message if any (though navigation might make this brief) */}
                {message && !errors.form && <p className="alert alert-success text-center">{message}</p>}


                <form onSubmit={handleSubmit} noValidate style={{ fontSize: '25px', fontWeight: '700' }}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Child's Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      style={{ fontSize: '18px' }}
                    />
                    {errors.name && <div className="invalid-feedback" style={{fontSize: '14px'}}>{errors.name}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      style={{ fontSize: '18px' }}
                    />
                    {errors.password && <div className="invalid-feedback" style={{fontSize: '14px'}}>{errors.password}</div>}
                  </div>
                  <br />
                  <button type="submit" className="btn w-100" style={{ fontSize: '22px', backgroundColor: '#4083A8', color: 'white', height: '50px', fontWeight: 'bold' }}>
                    Sign In
                  </button>
                </form>

                {/* Removed the success message from here as it's handled above or navigation occurs */}

                <div className="text-center mt-4"> {/* Increased margin-top */}
                  <p style={{ fontSize: '16px', color: '#555' }}>
                    Don't have an account?{" "}
                    <Link to="/sign-up" style={{ color: '#4083A8', fontWeight: 'bold', textDecoration: 'none' }}>
                      Sign Up
                    </Link>
                  </p>
                </div>
                 <div className="text-center mt-2">
                  <Link to="/forgot-password" style={{ color: '#007bff', fontSize: '15px', textDecoration: 'none' }}>
                    Forgot Password?
                  </Link>
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

