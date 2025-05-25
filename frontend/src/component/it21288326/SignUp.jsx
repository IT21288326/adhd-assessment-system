// // import React, { useState } from "react";
// // import axios from "axios";

// // const SignUp = () => {
// //   const [formData, setFormData] = useState({
// //     name: "",
// //     age: "",
// //     gender: "Male",
  
// //     password: "",
// //     parentEmail: "",
// //   });

// //   const [message, setMessage] = useState("");

// //   const handleChange = (e) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const response = await axios.post("http://localhost:8800/api/child/signup", formData);
// //       setMessage(response.data.message);
// //     } catch (error) {
// //       setMessage(error.response?.data?.message || "An error occurred.");
// //     }
// //   };

// //   return (
// //     // <div>
// //     //   <h1>Sign Up</h1>
// //     //   <form onSubmit={handleSubmit}>
// //     //     <input
// //     //       type="text"
// //     //       name="name"
// //     //       placeholder="Child's Name"
// //     //       value={formData.name}
// //     //       onChange={handleChange}
// //     //       required
// //     //     />

// //     //     <select name="gender" value={formData.gender} onChange={handleChange}>
// //     //       <option value="Male">Male</option>
// //     //       <option value="Female">Female</option>
// //     //       <option value="Other">Other</option>
// //     //     </select>

// //     //     <input
// //     //       type="number"
// //     //       name="age"
// //     //       placeholder="Age"
// //     //       value={formData.age}
// //     //       onChange={handleChange}
// //     //       required
// //     //     />
// //     //     <input
// //     //       type="password"
// //     //       name="password"
// //     //       placeholder="Password"
// //     //       value={formData.password}
// //     //       onChange={handleChange}
// //     //       required
// //     //     />
// //     //     <input
// //     //       type="email"
// //     //       name="parentEmail"
// //     //       placeholder="Parent Email"
// //     //       value={formData.parentEmail}
// //     //       onChange={handleChange}
// //     //       required
// //     //     />
// //     //     <button type="submit">Sign Up</button>
// //     //   </form>
// //     //   {message && <p>{message}</p>}
// //     // </div>

// // <div className="signin-page">
// //     <div className="container mt-5">
// //   <div className="row justify-content-center" style={{ marginTop: '80px',marginBottom:'50px' }}>
// //     <div className="col-md-6">
// //       <div className="card shadow">
// //         <div className="card-header text-center bg-white">
// //           <img
// //             src="/assets/it21288326/pulsemindlogo.jpg"
// //             alt="Sign Up Illustration"
// //             className="img-fluid"
// //           />
// //         </div>
// //         <div className="card-body">
// //           <h1 className="text-center mb-4" style={{ fontSize: '40px', fontWeight: '800' }}>
// //             Sign Up
// //           </h1>
// //           <form onSubmit={handleSubmit} style={{ fontSize: '25px', fontWeight: '700' }}>
// //             <div className="mb-3">
// //               <label htmlFor="name" className="form-label">
// //                 Child's Name
// //               </label>
// //               <input
// //                 type="text"
// //                 id="name"
// //                 name="name"
// //                 className="form-control"
// //                 placeholder="Enter your name"
// //                 value={formData.name}
// //                 onChange={handleChange}
// //                 required
// //                 style={{ fontSize: '18px' }}
// //               />
// //             </div>

// //             <div className="mb-3">
// //               <label htmlFor="gender" className="form-label">
// //                 Gender
// //               </label>
// //               <select
// //                 id="gender"
// //                 name="gender"
// //                 className="form-control"
// //                 value={formData.gender}
// //                 onChange={handleChange}
// //                 style={{ fontSize: '18px' }}
// //               >
// //                 <option value="Male">Male</option>
// //                 <option value="Female">Female</option>
// //                 <option value="Other">Other</option>
// //               </select>
// //             </div>

// //             <div className="mb-3">
// //               <label htmlFor="age" className="form-label">
// //                 Age
// //               </label>
// //               <input
// //                 type="number"
// //                 id="age"
// //                 name="age"
// //                 className="form-control"
// //                 placeholder="Enter age"
// //                 value={formData.age}
// //                 onChange={handleChange}
// //                 required
// //                 style={{ fontSize: '18px' }}
// //               />
// //             </div>

// //             <div className="mb-3">
// //               <label htmlFor="password" className="form-label">
// //                 Password
// //               </label>
// //               <input
// //                 type="password"
// //                 id="password"
// //                 name="password"
// //                 className="form-control"
// //                 placeholder="Enter your password"
// //                 value={formData.password}
// //                 onChange={handleChange}
// //                 required
// //                 style={{ fontSize: '18px' }}
// //               />
// //             </div>

// //             <div className="mb-3">
// //               <label htmlFor="parentEmail" className="form-label">
// //                 Parent Email
// //               </label>
// //               <input
// //                 type="email"
// //                 id="parentEmail"
// //                 name="parentEmail"
// //                 className="form-control"
// //                 placeholder="Enter parent email"
// //                 value={formData.parentEmail}
// //                 onChange={handleChange}
// //                 required
// //                 style={{ fontSize: '18px' }}
// //               />
// //             </div>
// // <br></br>
// //             <button
// //               type="submit"
// //               className="btn w-100"
// //               style={{ fontSize: '25px', backgroundColor: '#4083A8', color: 'white', height: '50px' }}
// //             >
// //               Sign Up
// //             </button>
// //           </form>
// //           {message && <p className="text-success text-center mt-3">{message}</p>}
// //         </div>
// //       </div>
// //     </div>
// //   </div>
// // </div>
// // </div>

// //   );
// // };

// // export default SignUp;

// import React, { useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";

// const SignUp = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     age: "",
//     gender: "Male",
//     password: "",
//     confirmPassword: "", // Added for password confirmation
//     parentEmail: "",
//   });

//   const [message, setMessage] = useState("");
//   const [errors, setErrors] = useState({}); // Changed to an object for multiple errors

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.name.trim()) {
//       newErrors.name = "Child's name is required.";
//     } else if (formData.name.trim().length < 2) {
//       newErrors.name = "Name must be at least 2 characters long.";
//     }

//     if (!formData.age) {
//       newErrors.age = "Age is required.";
//     } else if (isNaN(formData.age) || parseInt(formData.age, 10) <= 0) {
//       newErrors.age = "Please enter a valid age.";
//     } else if (parseInt(formData.age, 10) > 18) {
//       newErrors.age = "Age should typically be 18 or younger for a child account."; // Example specific validation
//     }

//     if (!formData.parentEmail.trim()) {
//       newErrors.parentEmail = "Parent's email is required.";
//     } else if (!/\S+@\S+\.\S+/.test(formData.parentEmail)) {
//       newErrors.parentEmail = "Parent's email address is invalid.";
//     }

//     if (!formData.password) {
//       newErrors.password = "Password is required.";
//     } else if (formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters long.";
//     }
//     // Example: Password strength (simple)
//     // else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
//     //   newErrors.password = "Password must include uppercase, lowercase, and a number.";
//     // }


//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = "Confirm password is required.";
//     } else if (formData.password && formData.confirmPassword !== formData.password) {
//       newErrors.confirmPassword = "Passwords do not match.";
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0; // Return true if no errors
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     // Clear specific error when user types
//     if (errors[name]) {
//       setErrors({ ...errors, [name]: null });
//     }
//     setMessage(""); // Clear general message
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setErrors({}); // Clear previous errors

//     if (!validate()) { // Perform validation
//       return; // Stop submission if validation fails
//     }

//     try {
//       // Exclude confirmPassword from data sent to backend
//       const { confirmPassword, ...dataToSubmit } = formData;
//       const response = await axios.post(
//         "http://localhost:8800/api/child/signup",
//         dataToSubmit
//       );
//       setMessage(response.data.message);
//       setFormData({ // Reset form
//         name: "",
//         age: "",
//         gender: "Male",
//         password: "",
//         confirmPassword: "",
//         parentEmail: "",
//       });
//       setErrors({}); // Clear errors on success
//     } catch (err) {
//       // Handle backend validation errors or other errors
//       if (err.response && err.response.data && err.response.data.errors) {
//         // If backend sends specific field errors
//         setErrors(err.response.data.errors);
//       } else {
//         setErrors({ form: err.response?.data?.message || "An error occurred during sign up." });
//       }
//     }
//   };

//   return (
//     <div className="signin-page">
//       <div className="container mt-5">
//         <div className="row justify-content-center" style={{ marginTop: '80px', marginBottom: '50px' }}>
//           <div className="col-md-6">
//             <div className="card shadow">
//               <div className="card-header text-center bg-white">
//                 <img
//                   src="/assets/it21288326/pulsemindlogo.jpg"
//                   alt="Sign Up Illustration"
//                   className="img-fluid"
//                   style={{ maxHeight: "150px", marginTop: "20px" }}
//                 />
//               </div>
//               <div className="card-body">
//                 <h1 className="text-center mb-4" style={{ fontSize: '40px', fontWeight: '800' }}>
//                   Create Account
//                 </h1>
//                 {message && <p className="alert alert-success text-center">{message}</p>}
//                 {errors.form && <p className="alert alert-danger text-center">{errors.form}</p>}

//                 <form onSubmit={handleSubmit} noValidate style={{ fontSize: '25px', fontWeight: '700' }}>
//                   {/* Name Field */}
//                   <div className="mb-3">
//                     <label htmlFor="name" className="form-label">
//                       Child's Name
//                     </label>
//                     <input
//                       type="text"
//                       id="name"
//                       name="name"
//                       className={`form-control ${errors.name ? 'is-invalid' : ''}`}
//                       placeholder="Enter child's name"
//                       value={formData.name}
//                       onChange={handleChange}
//                       style={{ fontSize: '18px' }}
//                     />
//                     {errors.name && <div className="invalid-feedback" style={{fontSize: '14px'}}>{errors.name}</div>}
//                   </div>

//                   {/* Gender Field */}
//                   <div className="mb-3">
//                     <label htmlFor="gender" className="form-label">
//                       Gender
//                     </label>
//                     <select
//                       id="gender"
//                       name="gender"
//                       className="form-control" // No specific error for gender dropdown unless required
//                       value={formData.gender}
//                       onChange={handleChange}
//                       style={{ fontSize: '18px' }}
//                     >
//                       <option value="Male">Male</option>
//                       <option value="Female">Female</option>
//                       <option value="Other">Other</option>
//                     </select>
//                   </div>

//                   {/* Age Field */}
//                   <div className="mb-3">
//                     <label htmlFor="age" className="form-label">
//                       Age
//                     </label>
//                     <input
//                       type="number"
//                       id="age"
//                       name="age"
//                       className={`form-control ${errors.age ? 'is-invalid' : ''}`}
//                       placeholder="Enter age"
//                       value={formData.age}
//                       onChange={handleChange}
//                       style={{ fontSize: '18px' }}
//                     />
//                     {errors.age && <div className="invalid-feedback" style={{fontSize: '14px'}}>{errors.age}</div>}
//                   </div>

//                   {/* Parent Email Field */}
//                   <div className="mb-3">
//                     <label htmlFor="parentEmail" className="form-label">
//                       Parent's Email
//                     </label>
//                     <input
//                       type="email"
//                       id="parentEmail"
//                       name="parentEmail"
//                       className={`form-control ${errors.parentEmail ? 'is-invalid' : ''}`}
//                       placeholder="Enter parent's email address"
//                       value={formData.parentEmail}
//                       onChange={handleChange}
//                       style={{ fontSize: '18px' }}
//                     />
//                     {errors.parentEmail && <div className="invalid-feedback" style={{fontSize: '14px'}}>{errors.parentEmail}</div>}
//                   </div>

//                   {/* Password Field */}
//                   <div className="mb-3">
//                     <label htmlFor="password" className="form-label">
//                       Password
//                     </label>
//                     <input
//                       type="password"
//                       id="password"
//                       name="password"
//                       className={`form-control ${errors.password ? 'is-invalid' : ''}`}
//                       placeholder="Create a password"
//                       value={formData.password}
//                       onChange={handleChange}
//                       style={{ fontSize: '18px' }}
//                     />
//                     {errors.password && <div className="invalid-feedback" style={{fontSize: '14px'}}>{errors.password}</div>}
//                   </div>

//                   {/* Confirm Password Field */}
//                   <div className="mb-3">
//                     <label htmlFor="confirmPassword" className="form-label">
//                       Confirm Password
//                     </label>
//                     <input
//                       type="password"
//                       id="confirmPassword"
//                       name="confirmPassword"
//                       className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
//                       placeholder="Confirm your password"
//                       value={formData.confirmPassword}
//                       onChange={handleChange}
//                       style={{ fontSize: '18px' }}
//                     />
//                     {errors.confirmPassword && <div className="invalid-feedback" style={{fontSize: '14px'}}>{errors.confirmPassword}</div>}
//                   </div>

//                   <br />
//                   <button
//                     type="submit"
//                     className="btn w-100"
//                     style={{ fontSize: '22px', backgroundColor: '#4083A8', color: 'white', height: '50px', fontWeight: 'bold' }}
//                   >
//                     Sign Up
//                   </button>
//                 </form>

//                 <div className="text-center mt-4">
//                   <p style={{ fontSize: '16px', color: '#555' }}>
//                     Already have an account?{" "}
//                     <Link to="/" style={{ color: '#4083A8', fontWeight: 'bold', textDecoration: 'none' }}>
//                       Sign In
//                     </Link>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUp;
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "", // Kept as string to handle empty input and direct typing
    gender: "Male",
    password: "",
    confirmPassword: "",
    parentEmail: "",
  });

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    // Name Validation
    if (!formData.name.trim()) {
      newErrors.name = "Child's name is required.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long.";
    }

    // Age Validation
    if (!formData.age) { // Check if formData.age is empty (it's a string)
      newErrors.age = "Age is required.";
    } else {
      const ageNum = parseInt(formData.age, 10); // Convert to number for logical checks
      if (isNaN(ageNum) || ageNum <= 0) { // Ensure age is positive after conversion
        newErrors.age = "Please enter a valid positive age.";
      } else if (ageNum > 18) { // Example: Max age check
        newErrors.age = "Age should typically be 18 or younger for a child account.";
      }
    }

    // Parent Email Validation
    if (!formData.parentEmail.trim()) {
      newErrors.parentEmail = "Parent's email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.parentEmail)) {
      newErrors.parentEmail = "Parent's email address is invalid.";
    }

    // Password Validation
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    // Confirm Password Validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required.";
    } else if (formData.password && formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "age") {
      // Allow empty string or positive integers only by stripping non-digits.
      // This effectively prevents '-', '.', 'e', etc.
      value = value.replace(/[^0-9]/g, '');

      // Optional: If you want to cap the length or max value during typing
      // For example, to prevent typing more than 2 or 3 digits:
      // if (value.length > 2 && parseInt(value, 10) > 18) { // Example limit
      //   value = value.slice(0, 2); // or some other capping logic
      // }
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // Clear specific error when user types
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
    }
    setMessage(""); // Clear general success/error message
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({}); // Clear previous errors before new validation

    if (!validate()) { // Perform validation
      return; // Stop submission if validation fails
    }

    try {
      // Exclude confirmPassword from data sent to backend
      const { confirmPassword, ...dataToSubmit } = formData;
      const response = await axios.post(
        "http://localhost:8800/api/child/signup", // Ensure your backend endpoint is correct
        dataToSubmit
      );
      setMessage(response.data.message);
      setFormData({ // Reset form on success
        name: "",
        age: "",
        gender: "Male",
        password: "",
        confirmPassword: "",
        parentEmail: "",
      });
      setErrors({}); // Clear any errors on success
    } catch (err) {
      if (err.response && err.response.data) {
        if (err.response.data.errors) { // Field-specific errors from backend
          setErrors(err.response.data.errors);
        } else if (err.response.data.message) { // General error message from backend
          setErrors({ form: err.response.data.message });
        } else {
          setErrors({ form: "An unknown error occurred during sign up." });
        }
      } else {
        setErrors({ form: "An error occurred. Please check your connection and try again." });
      }
    }
  };

  return (
    <div className="signin-page"> {/* Assuming this class provides overall page styling */}
      <div className="container mt-5">
        <div className="row justify-content-center" style={{ marginTop: '80px', marginBottom: '50px' }}>
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-header text-center bg-white">
                <img
                  src="/assets/it21288326/pulsemindlogo.jpg" // Make sure this path is correct
                  alt="Sign Up Illustration"
                  className="img-fluid"
                  style={{ maxHeight: "150px", marginTop: "20px" }}
                />
              </div>
              <div className="card-body">
                <h1 className="text-center mb-4" style={{ fontSize: '40px', fontWeight: '800' }}>
                  Create Account
                </h1>
                {message && <p className="alert alert-success text-center">{message}</p>}
                {errors.form && <p className="alert alert-danger text-center">{errors.form}</p>}

                <form onSubmit={handleSubmit} noValidate style={{ fontSize: '25px', fontWeight: '700' }}>
                  {/* Name Field */}
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Child's Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      placeholder="Enter child's name"
                      value={formData.name}
                      onChange={handleChange}
                      style={{ fontSize: '18px' }}
                    />
                    {errors.name && <div className="invalid-feedback" style={{fontSize: '14px'}}>{errors.name}</div>}
                  </div>

                  {/* Gender Field */}
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

                  {/* Age Field */}
                  <div className="mb-3">
                    <label htmlFor="age" className="form-label">
                      Age
                    </label>
                    <input
                      type="number" // Using type="number" for browser features like spinners
                      id="age"
                      name="age"
                      className={`form-control ${errors.age ? 'is-invalid' : ''}`}
                      placeholder="Enter age"
                      value={formData.age}
                      onChange={handleChange}
                      min="1" // Browser hint for minimum value, affects spinners
                      style={{ fontSize: '18px' }}
                    />
                    {errors.age && <div className="invalid-feedback" style={{fontSize: '14px'}}>{errors.age}</div>}
                  </div>

                  {/* Parent Email Field */}
                  <div className="mb-3">
                    <label htmlFor="parentEmail" className="form-label">
                      Parent's Email
                    </label>
                    <input
                      type="email"
                      id="parentEmail"
                      name="parentEmail"
                      className={`form-control ${errors.parentEmail ? 'is-invalid' : ''}`}
                      placeholder="Enter parent's email address"
                      value={formData.parentEmail}
                      onChange={handleChange}
                      style={{ fontSize: '18px' }}
                    />
                    {errors.parentEmail && <div className="invalid-feedback" style={{fontSize: '14px'}}>{errors.parentEmail}</div>}
                  </div>

                  {/* Password Field */}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      style={{ fontSize: '18px' }}
                    />
                    {errors.password && <div className="invalid-feedback" style={{fontSize: '14px'}}>{errors.password}</div>}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      style={{ fontSize: '18px' }}
                    />
                    {errors.confirmPassword && <div className="invalid-feedback" style={{fontSize: '14px'}}>{errors.confirmPassword}</div>}
                  </div>

                  <br />
                  <button
                    type="submit"
                    className="btn w-100"
                    style={{ fontSize: '22px', backgroundColor: '#4083A8', color: 'white', height: '50px', fontWeight: 'bold' }}
                  >
                    Sign Up
                  </button>
                </form>

                <div className="text-center mt-4">
                  <p style={{ fontSize: '16px', color: '#555' }}>
                    Already have an account?{" "}
                    <Link to="/" style={{ color: '#4083A8', fontWeight: 'bold', textDecoration: 'none' }}>
                      Sign In
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

export default SignUp;
