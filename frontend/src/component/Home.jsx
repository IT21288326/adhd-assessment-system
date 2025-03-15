
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";

// const Home = () => {
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

//     <div className="home" style={{ backgroundColor: "lightblue" }}>
//   <div style={{ textAlign: 'center' }}>
//     <h1 style={{ fontSize: '80px', fontWeight: 'bold', marginTop: '30px' }}>Welcome {child.name} !!</h1>

//     <div className="row" style={{ height: '60%', marginTop: '60px', display: 'flex', justifyContent: 'center' }}>
//       <div className="col-sm-4" style={{ display: 'flex', justifyContent: 'center' }}>
//         <div
//           className="card"
//           style={{
//             boxShadow: '10px 14px 18px rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
//             opacity: '0.88',
//             width: '80%',
//             height: '100%',
//             borderRadius: '60px',
//           }}
//         >
//           <div className="card-body" style={{ textAlign: 'center' }}>
//             <Link to="/profile" state={{ childId: child._id }} className="link-style">
//               <p style={{ fontSize: '40px', fontWeight: 'bold' }}>ADHD Assessment</p>
//               <img
//                 src="/assets/it21288326/assess.jpg"
//                 alt="Image description"
//                 style={{ width: '70%', height: '65%', marginTop: '20px', borderRadius: '40px', cursor: 'pointer' }}
//               />
//             </Link>
//           </div>
//         </div>
//       </div>
//       <div className="col-sm-4" style={{ display: 'flex', justifyContent: 'center' }}>
//         <div
//           className="card"
//           style={{
//             boxShadow: '10px 14px 18px rgba(0, 0, 0, 0.5)',
//             opacity: '0.88',
//             width: '80%',
//             height: '100%',
//             borderRadius: '60px',
//           }}
//         >
//           <div className="card-body" style={{ textAlign: 'center' }}>
//             <Link to="/questionnaire-form" state={{ childId: child._id }} className="link-style">
//               <p style={{ fontSize: '40px', fontWeight: 'bold' }}>Focus Development</p>
//               <img
//                 src="/assets/it21288326/focus.jpg"
//                 alt="Image description"
//                 style={{ width: '70%', height: '65%', marginTop: '20px', borderRadius: '10px', cursor: 'pointer' }}
//               />
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>

    
//     <div className="row" style={{ height: '60%', marginTop: '80px', display: 'flex', justifyContent: 'center',marginBottom:'60px' }}>
//       <div className="col-sm-4" style={{ display: 'flex', justifyContent: 'center' }}>
//         <div
//           className="card"
//           style={{
//             boxShadow: '10px 14px 18px rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
//             opacity: '0.88',
//             width: '80%',
//             height: '100%',
//             borderRadius: '60px',
//           }}
//         >
//           <div className="card-body" style={{ textAlign: 'center' }}>
//             <Link to="/reaction-time-game" state={{ childId: child._id }} className="link-style">
//               <p style={{ fontSize: '40px', fontWeight: 'bold' }}>Impulse Control</p>
//               <img
//                 src="/assets/it21288326/impulse.jpg"
//                 alt="Image description"
//                 style={{ width: '70%', height: '65%', marginTop: '20px', borderRadius: '40px', cursor: 'pointer' }}
//               />
//             </Link>
//           </div>
//         </div>
//       </div>
//       <div className="col-sm-4" style={{ display: 'flex', justifyContent: 'center' }}>
//         <div
//           className="card"
//           style={{
//             boxShadow: '10px 14px 18px rgba(0, 0, 0, 0.5)',
//             opacity: '0.88',
//             width: '80%',
//             height: '100%',
//             borderRadius: '60px',
//           }}
//         >
//           <div className="card-body" style={{ textAlign: 'center' }}>
//             <Link to="/questionnaire-form" state={{ childId: child._id }} className="link-style">
//               <p style={{ fontSize: '40px', fontWeight: 'bold' }}>Summary Reports</p>
//               <img
//                 src="/assets/it21288326/report.jpg"
//                 alt="Image description"
//                 style={{ width: '70%', height: '65%', marginTop: '20px', borderRadius: '10px', cursor: 'pointer' }}
//               />
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>


//   </div>
// </div>



//   );
// };

// export default Home;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Home = () => {
  const [child, setChild] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get("http://localhost:8800/api/child/profile", {
          withCredentials: true,
        });
        setChild(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        navigate("/signin");
      }
    };

    fetchProfile();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="loading-container" style={{ 
        backgroundColor: "lightblue", 
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <div className="loading-animation">
          <h2>Loading your fun activities...</h2>
          <div className="loading-dots">
            <span style={{ 
              display: "inline-block",
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "#4682B4",
              margin: "0 8px",
              animation: "bounce 1.4s infinite ease-in-out both"
            }}></span>
            <span style={{ 
              display: "inline-block",
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "#4682B4",
              margin: "0 8px",
              animation: "bounce 1.4s infinite ease-in-out both",
              animationDelay: "0.2s"
            }}></span>
            <span style={{ 
              display: "inline-block",
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "#4682B4",
              margin: "0 8px",
              animation: "bounce 1.4s infinite ease-in-out both",
              animationDelay: "0.4s"
            }}></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home" style={{ 
      backgroundColor: "lightblue",
      minHeight: "100vh",
      padding: "20px",
      fontFamily: "'Comic Sans MS', 'Marker Felt', sans-serif"
    }}>
      <div className="container">
        <div className="welcome-section" style={{ 
          textAlign: "center",
          marginBottom: "30px"
        }}>
          <h1 style={{ 
            fontSize: "clamp(40px, 8vw, 80px)",
            fontWeight: "bold",
            color: "#0066CC",
            marginTop: "20px",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)"
          }}>
            Hello, {child.name}! 
            <span role="img" aria-label="waving hand" style={{ marginLeft: "10px" }}>👋</span>
          </h1>
          <p style={{ 
            fontSize: "clamp(16px, 3vw, 24px)",
            marginTop: "10px",
            color: "#444"
          }}>
            What would you like to do today?
          </p>
        </div>
        
        <div className="activities-grid" style={{ 
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "30px",
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          {/* ADHD Assessment Card */}
          <ActivityCard 
            title="ADHD Assessment"
            emoji="🧠"
            imageSrc="/assets/it21288326/assess.jpg"
            linkTo="/profile"
            childId={child._id}
            backgroundColor="#87CEEB"
          />
          
          {/* Focus Development Card */}
          <ActivityCard 
            title="Focus Development"
            emoji="🎯"
            imageSrc="/assets/it21288326/focus.jpg"
            linkTo="/questionnaire-form"
            childId={child._id}
            backgroundColor="#90EE90"
          />
          
          {/* Impulse Control Card */}
          <ActivityCard 
            title="Impulse Control"
            emoji="⏱️"
            imageSrc="/assets/it21288326/impulse.jpg"
            linkTo="/reaction-time-game"
            childId={child._id}
            backgroundColor="#FFB6C1"
          />
          
          {/* Summary Reports Card */}
          <ActivityCard 
            title="My Progress"
            emoji="📊"
            imageSrc="/assets/it21288326/report.jpg"
            linkTo="/questionnaire-form"
            childId={child._id}
            backgroundColor="#FFFFE0"
          />
        </div>
      </div>
    </div>
  );
};

// Activity Card Component for better code organization
const ActivityCard = ({ title, emoji, imageSrc, linkTo, childId, backgroundColor }) => {
  return (
    <Link 
      to={linkTo} 
      state={{ childId }} 
      className="activity-card-link"
      style={{ textDecoration: "none" }}
    >
      <div className="activity-card" style={{
        backgroundColor: backgroundColor,
        borderRadius: "25px",
        overflow: "hidden",
        transition: "transform 0.3s, box-shadow 0.3s",
        boxShadow: "8px 8px 15px rgba(0, 0, 0, 0.2)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "15px",
        cursor: "pointer",
        transform: "translateY(0)",
        position: "relative"
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-10px)";
        e.currentTarget.style.boxShadow = "10px 15px 25px rgba(0, 0, 0, 0.3)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "8px 8px 15px rgba(0, 0, 0, 0.2)";
      }}
      >
        <div className="card-header" style={{ 
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "15px"
        }}>
          <h2 style={{ 
            fontSize: "clamp(22px, 4vw, 32px)",
            fontWeight: "bold",
            color: "#333",
            margin: "0",
            textAlign: "center" 
          }}>{title} <span role="img" aria-label="activity icon">{emoji}</span></h2>
        </div>
        
        <div className="card-image" style={{ 
          flex: "1",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "10px"
        }}>
          <img
            src={imageSrc}
            alt={`${title} activity`}
            style={{ 
              width: "85%",
              height: "auto",
              borderRadius: "20px",
              objectFit: "cover",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
            }}
          />
        </div>
        
        <div className="card-footer" style={{ 
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          padding: "10px",
          borderRadius: "12px",
          textAlign: "center"
        }}>
          <p style={{ 
            margin: "0",
            fontSize: "16px",
            fontWeight: "bold" 
          }}>Let's Go!</p>
        </div>
      </div>
    </Link>
  );
};

export default Home;