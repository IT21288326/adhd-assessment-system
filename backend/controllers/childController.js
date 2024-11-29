// import Child from '../models/Child.js';
// import crypto from 'crypto';
// import nodemailer from 'nodemailer';
// import session from 'express-session';
// import bcrypt from 'bcryptjs';


// // Sign-Up Controller
// export const signUp = async (req, res) => {
//   try {
//     const { name, age, gender, password, parentEmail } = req.body;

//     if (!name || !age || !gender || !password || !parentEmail) {
//       return res.status(400).json({ message: 'All fields are required.' });
//     }

//     const existingChild = await Child.findOne({ name, age });
//     if (existingChild) {
//       return res.status(400).json({ message: 'Child already exists.' });
//     }

//     const child = new Child({ name, age, gender, password, parentEmail });
//     await child.save();

//     res.status(201).json({ message: 'Sign-up successful!' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error signing up.', error });
//   }
// };

// // // Sign-In Controller
// // export const signIn = async (req, res) => {
// //   const { name, password } = req.body;

// //   try {
// //     const child = await Child.findOne({ name });
// //     if (!child) {
// //       return res.status(404).json({ message: 'Child not found' });
// //     }

// //     const isPasswordValid = await child.matchPassword(password);
// //     if (!isPasswordValid) {
// //       return res.status(401).json({ message: 'Invalid credentials' });
// //     }

// //     res.status(200).json({
// //       message: 'Login successful',
// //       childId: child._id,
// //       child: {
// //         name: child.name,
// //         age: child.age,
// //         gender: child.gender,
// //       },
// //     });
// //   } catch (error) {
// //     res.status(500).json({ message: 'Something went wrong.', error });
// //   }
// // };
// export const signIn = async (req, res) => {
//     const { name, password } = req.body;
  
//     try {
//       const child = await Child.findOne({ name });
//       if (!child) {
//         return res.status(404).json({ message: 'Child not found' });
//       }
  
//       const isPasswordValid = await bcrypt.compare(password, child.password);
//       if (!isPasswordValid) {
//         return res.status(401).json({ message: 'Invalid credentials' });
//       }
  
//       // Store the user's ID in the session
//       req.session.childId = child._id;
  
//       res.status(200).json({
//         message: 'Login successful',
//         child: {
//           id: child._id,
//           name: child.name,
//           age: child.age,
//           gender: child.gender,
//         },
//       });
//     } catch (error) {
//       console.error('Sign-in error:', error);
//       res.status(500).json({ message: 'Something went wrong.', error });
//     }
//   };

// export const signOut = (req, res) => {
//     req.session.destroy((err) => {
//       if (err) {
//         console.error('Error logging out:', err);
//         return res.status(500).json({ message: 'Unable to log out' });
//       }
//       res.clearCookie('connect.sid'); // Clear the session cookie
//       res.status(200).json({ message: 'Logged out successfully' });
//     });
//   };
  

// // Password Reset Request Controller
// export const requestPasswordReset = async (req, res) => {
//   try {
//     const { parentEmail } = req.body;

//     if (!parentEmail) {
//       return res.status(400).json({ message: 'Parent email is required.' });
//     }

//     const child = await Child.findOne({ parentEmail });
//     if (!child) {
//       return res.status(404).json({ message: 'No child found with this email.' });
//     }

//     const resetToken = child.generateResetToken();
//     await child.save();

//     const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
//     const message = `You requested a password reset. Click the link to reset your password: ${resetUrl}`;

//     const transporter = nodemailer.createTransport({
//       service: 'Gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     await transporter.sendMail({
//       from: `"ADHD Assessment App" <${process.env.EMAIL_USER}>`,
//       to: parentEmail,
//       subject: 'Password Reset Request',
//       text: message,
//     });

//     res.status(200).json({ message: 'Password reset link sent to parent email.' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error sending reset email.', error });
//   }
// };

// // Reset Password Controller
// export const resetPassword = async (req, res) => {
//   try {
//     const { token } = req.params;
//     const { password } = req.body;

//     const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
//     const child = await Child.findOne({
//       resetPasswordToken: hashedToken,
//       resetPasswordExpire: { $gt: Date.now() },
//     });

//     if (!child) {
//       return res.status(400).json({ message: 'Invalid or expired token.' });
//     }

//     child.password = password;
//     child.resetPasswordToken = undefined;
//     child.resetPasswordExpire = undefined;

//     await child.save();

//     res.status(200).json({ message: 'Password reset successful!' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error resetting password.', error });
//   }
// };

// export const getChildProfile = async (req, res) => {
//     if (!req.session.child) {
//       return res.status(401).json({ message: "Unauthorized. Please log in." });
//     }
  
//     try {
//       const child = await Child.findById(req.session.child._id).select("_id name age gender");
//       if (!child) {
//         return res.status(404).json({ message: "Child not found." });
//       }
  
//       res.status(200).json({ childId: child._id, child });
//     } catch (error) {
//       console.error("Error fetching child profile:", error);
//       res.status(500).json({ message: "Internal server error." });
//     }
//   };
import Child from '../models/Child.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import session from 'express-session';
import bcrypt from 'bcryptjs';

// Sign-Up Controller
export const signUp = async (req, res) => {
  try {
    const { name, age, gender, password, parentEmail } = req.body;

    if (!name || !age || !gender || !password || !parentEmail) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingChild = await Child.findOne({ name, age });
    if (existingChild) {
      return res.status(400).json({ message: 'Child already exists.' });
    }

    const child = new Child({ name, age, gender, password, parentEmail });
    await child.save();

    res.status(201).json({ message: 'Sign-up successful!' });
  } catch (error) {
    console.error('Sign-up error:', error);
    res.status(500).json({ message: 'Error signing up.', error });
  }
};

// Sign-In Controller

export const signIn = async (req, res) => {
  const { name, password } = req.body;

  // Validate input fields
  if (!name || !password) {
    return res.status(400).json({ message: 'Name and password are required.' });
  }

  try {
    // Find the child by name
    const child = await Child.findOne({ name });
    
    // If the child is not found
    if (!child) {
      return res.status(404).json({ message: 'Child not found.' });
    }

    // Compare the password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, child.password);
    
    // If the password is not valid
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Store the childId in the session
    req.session.childId = child._id;

    // Send the response back to the client
    res.status(200).json({
      message: 'Login successful',
      child: {
        id: child._id,
        name: child.name,
        age: child.age,
        gender: child.gender,
      },
    });
  } catch (error) {
    // Log the error for debugging
    console.error('Sign-in error:', error);

    // Return a server error response
    res.status(500).json({ message: 'Something went wrong.', error: error.message });
  }
};


// Sign-Out Controller
export const signOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error logging out:', err);
      return res.status(500).json({ message: 'Unable to log out.' });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logged out successfully.' });
  });
};

// Request Password Reset Controller
export const requestPasswordReset = async (req, res) => {
  try {
    const { parentEmail } = req.body;
    if (!parentEmail) {
      return res.status(400).json({ message: 'Parent email is required.' });
    }

    const child = await Child.findOne({ parentEmail });
    if (!child) {
      return res.status(404).json({ message: 'No child found with this email.' });
    }

    const resetToken = child.generateResetToken();
    await child.save({ validateBeforeSave: false });

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    const message = `Click the link to reset the password: ${resetUrl}`;

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"ADHD Assessment App" <${process.env.EMAIL_USER}>`,
      to: parentEmail,
      subject: 'Password Reset Request',
      text: message,
    });

    res.status(200).json({ message: 'Password reset link sent to parent email.' });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ message: 'Error sending reset email.', error });
  }
};

// Reset Password Controller
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const child = await Child.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!child) {
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }

    child.password = password;
    child.resetPasswordToken = undefined;
    child.resetPasswordExpire = undefined;
    await child.save();

    res.status(200).json({ message: 'Password reset successful!' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Error resetting password.', error });
  }
};

export const getChildProfile = async (req, res) => {
  try {
    console.log("Session Data: ", req.session); // Log session data to verify session exists
    const childId = req.session.childId;
    if (!childId) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }
    const child = await Child.findById(childId); // Replace with your DB logic
    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }
    res.json(child);
  } catch (error) {
    console.error("Error fetching child profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};


  
