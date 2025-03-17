
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// import './Profile.css'
// const Profile = () => {
//   const [child, setChild] = useState(null); // Manages child profile state
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const { data } = await axios.get("http://localhost:8800/api/child/profile", {
//           withCredentials: true, // Include cookies for authentication
//         });
//         setChild(data); // Set the child's profile data
//       } catch (error) {
//         console.error("Error fetching profile:", error);
//         navigate("/signin"); // Redirect to sign-in if not authenticated
//       }
//     };

//     fetchProfile();
//   }, [navigate]);

//   if (!child) {
//     return <p>Loading profile...</p>;
//   }

//   return (


// <div >
//   <div className="profile" style={{ textAlign: 'center' }}>
//   <h1 style={{ fontSize: '80px', fontWeight: 'bold', marginTop: '30px' }}>Welcome {child.name} !!</h1>

// <div className="row" style={{ height: '60%', marginTop: '100px', display: 'flex', justifyContent: 'center' }}>
//   <div className="col-sm-4" style={{ display: 'flex', justifyContent: 'center' }}>
//     <div
//       className="card"
//       style={{
//         boxShadow: '10px 14px 18px rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
//         opacity: '0.88',
//         width: '80%',
//         height: '90%',
//         borderRadius: '60px',
//       }}
//     >
//       <div className="card-body" style={{ textAlign: 'center' }}>
//         <Link to="/reaction-time-game" state={{ childId: child._id }} className="link-style">
//           <p style={{ fontSize: '60px', fontWeight: 'bold' }}>Play Game</p>
//           <img
//             src="/assets/it21288326/fallingstarlogo.jpg"
//             alt="Image description"
//             style={{ width: '60%', height: '55%', marginTop: '20px', borderRadius: '40px', cursor: 'pointer' }}
//           />
//         </Link>
//       </div>
//     </div>
//   </div>
//   <div className="col-sm-4" style={{ display: 'flex', justifyContent: 'center' }}>
//     <div
//       className="card"
//       style={{
//         boxShadow: '10px 14px 18px rgba(0, 0, 0, 0.5)',
//         opacity: '0.88',
//         width: '80%',
//         height: '90%',
//         borderRadius: '60px',
//       }}
//     >
//       <div className="card-body" style={{ textAlign: 'center' }}>
//         <Link to="/questionnaire-form" state={{ childId: child._id }} className="link-style">
//           <p style={{ fontSize: '60px', fontWeight: 'bold' }}>Parental Quiz</p>
//           <img
//             src="/assets/it21288326/parenticon.png"
//             alt="Image description"
//             style={{ width: '60%', height: '55%', marginTop: '20px', borderRadius: '10px', cursor: 'pointer' }}
//           />
//         </Link>
//       </div>
//     </div>
//   </div>
// </div>
//   </div>
// </div>

//   );
// };

// export default Profile;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import NavigationBar from "./NavigationBar"; // Updated import

const Profile = () => {
  const [child, setChild] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get("http://localhost:8800/api/child/profile", {
          withCredentials: true,
        });
        setChild(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        navigate("/signin");
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!child) {
    return (
      <div className="loading-container" style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e6f7ff'
      }}>
        <div className="loading-animation" style={{
          fontSize: '24px',
          color: '#0088cc',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <span style={{ display: 'inline-block', animation: 'bounce 1s infinite' }}>L</span>
            <span style={{ display: 'inline-block', animation: 'bounce 1s infinite 0.1s' }}>o</span>
            <span style={{ display: 'inline-block', animation: 'bounce 1s infinite 0.2s' }}>a</span>
            <span style={{ display: 'inline-block', animation: 'bounce 1s infinite 0.3s' }}>d</span>
            <span style={{ display: 'inline-block', animation: 'bounce 1s infinite 0.4s' }}>i</span>
            <span style={{ display: 'inline-block', animation: 'bounce 1s infinite 0.5s' }}>n</span>
            <span style={{ display: 'inline-block', animation: 'bounce 1s infinite 0.6s' }}>g</span>
            <span style={{ display: 'inline-block', animation: 'bounce 1s infinite 0.7s' }}>.</span>
            <span style={{ display: 'inline-block', animation: 'bounce 1s infinite 0.8s' }}>.</span>
            <span style={{ display: 'inline-block', animation: 'bounce 1s infinite 0.9s' }}>.</span>
          </div>
          <img 
            src="/assets/it21288326/loading-stars.gif" 
            alt="Loading" 
            style={{ width: '80px', height: '80px' }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ 
      backgroundColor: '#e6f7ff',
      minHeight: '100vh',
      fontFamily: 'Comic Sans MS, cursive, sans-serif',
      backgroundImage: 'url("/assets/it21288326/clouds-bg.jpg")',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      backgroundPosition: 'center'
    }}>
      {/* Added ResponsiveNavigationBar at the top */}
      <NavigationBar child={child} />
      
      <div className="profile-container" style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        padding: '20px'
      }}>
        {/* Removed previous NavigationBar since we've added the responsive one above */}
        
        <div className="menu-container" style={{ 
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '30px',
          justifyContent: 'center',
          margin: '40px 0'
        }}>
          <div className="menu-card" style={{
            flex: '1 1 300px',
            maxWidth: '400px',
            backgroundColor: '#ffffff',
            borderRadius: '30px',
            overflow: 'hidden',
            boxShadow: '0 15px 25px rgba(0, 0, 0, 0.3)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            border: '5px solid #66ccff'
          }}>
            <Link to="/reaction-time-game" state={{ childId: child._id }} style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'block'
            }}>
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2 style={{ 
                  fontSize: 'clamp(30px, 5vw, 50px)',
                  fontWeight: 'bold',
                  color: '#0088cc',
                  marginBottom: '15px'
                }}>
                  Play Game
                </h2>
                <div style={{
                  backgroundColor: '#e6f7ff',
                  borderRadius: '20px',
                  padding: '15px',
                  marginBottom: '15px'
                }}>
                  <img
                    src="/assets/it21288326/fallingstarlogo.jpg"
                    alt="Falling Star Game"
                    style={{ 
                      width: '80%',
                      borderRadius: '20px',
                      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)'
                    }}
                  />
                </div>
                <div style={{
                  backgroundColor: '#ffcc00',
                  borderRadius: '25px',
                  padding: '10px 15px',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  display: 'inline-block',
                  color: '#ffffff',
                  marginTop: '10px'
                }}>
                  Start Playing!
                </div>
              </div>
            </Link>
          </div>

          <div className="menu-card" style={{
            flex: '1 1 300px',
            maxWidth: '400px',
            backgroundColor: '#ffffff',
            borderRadius: '30px',
            overflow: 'hidden',
            boxShadow: '0 15px 25px rgba(0, 0, 0, 0.3)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            border: '5px solid #66ccff'
          }}>
            <Link to="/questionnaire-form" state={{ childId: child._id }} style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'block'
            }}>
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2 style={{ 
                  fontSize: 'clamp(30px, 5vw, 50px)',
                  fontWeight: 'bold',
                  color: '#0088cc',
                  marginBottom: '15px'
                }}>
                  Parental Quiz
                </h2>
                <div style={{
                  backgroundColor: '#e6f7ff',
                  borderRadius: '20px',
                  padding: '15px',
                  marginBottom: '15px'
                }}>
                  <img
                    src="/assets/it21288326/parenticon.png"
                    alt="Parent Quiz"
                    style={{ 
                      width: '80%',
                      borderRadius: '20px',
                      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)'
                    }}
                  />
                </div>
                <div style={{
                  backgroundColor: '#ff9966',
                  borderRadius: '25px',
                  padding: '10px 15px',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  display: 'inline-block',
                  color: '#ffffff',
                  marginTop: '10px'
                }}>
                  Take Quiz
                </div>
              </div>
            </Link>
          </div>
        </div>
        
        {/* <div className="footer" style={{
          textAlign: 'center',
          margin: '40px 0 20px',
          color: '#0088cc',
          fontSize: '16px'
        }}>
          <p>Have fun exploring!</p>
        </div> */}
      </div>
      
      <style>{`
        .menu-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 30px rgba(0, 0, 0, 0.4);
        }
        
        @media (max-width: 768px) {
          .profile-container {
            padding: 15px;
          }
          .menu-container {
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;