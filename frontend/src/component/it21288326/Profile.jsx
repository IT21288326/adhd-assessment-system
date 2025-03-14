
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import './Profile.css'
const Profile = () => {
  const [child, setChild] = useState(null); // Manages child profile state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get("http://localhost:8800/api/child/profile", {
          withCredentials: true, // Include cookies for authentication
        });
        setChild(data); // Set the child's profile data
      } catch (error) {
        console.error("Error fetching profile:", error);
        navigate("/signin"); // Redirect to sign-in if not authenticated
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!child) {
    return <p>Loading profile...</p>;
  }

  return (


<div >
  <div className="profile" style={{ textAlign: 'center' }}>
  <h1 style={{ fontSize: '80px', fontWeight: 'bold', marginTop: '30px' }}>Welcome {child.name} !!</h1>

<div className="row" style={{ height: '60%', marginTop: '100px', display: 'flex', justifyContent: 'center' }}>
  <div className="col-sm-4" style={{ display: 'flex', justifyContent: 'center' }}>
    <div
      className="card"
      style={{
        boxShadow: '10px 14px 18px rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
        opacity: '0.88',
        width: '80%',
        height: '90%',
        borderRadius: '60px',
      }}
    >
      <div className="card-body" style={{ textAlign: 'center' }}>
        <Link to="/reaction-time-game" state={{ childId: child._id }} className="link-style">
          <p style={{ fontSize: '60px', fontWeight: 'bold' }}>Play Game</p>
          <img
            src="/assets/it21288326/fallingstarlogo.jpg"
            alt="Image description"
            style={{ width: '60%', height: '55%', marginTop: '20px', borderRadius: '40px', cursor: 'pointer' }}
          />
        </Link>
      </div>
    </div>
  </div>
  <div className="col-sm-4" style={{ display: 'flex', justifyContent: 'center' }}>
    <div
      className="card"
      style={{
        boxShadow: '10px 14px 18px rgba(0, 0, 0, 0.5)',
        opacity: '0.88',
        width: '80%',
        height: '90%',
        borderRadius: '60px',
      }}
    >
      <div className="card-body" style={{ textAlign: 'center' }}>
        <Link to="/questionnaire-form" state={{ childId: child._id }} className="link-style">
          <p style={{ fontSize: '60px', fontWeight: 'bold' }}>Parental Quiz</p>
          <img
            src="/assets/it21288326/parenticon.png"
            alt="Image description"
            style={{ width: '60%', height: '55%', marginTop: '20px', borderRadius: '10px', cursor: 'pointer' }}
          />
        </Link>
      </div>
    </div>
  </div>
</div>
  </div>
</div>

  );
};

export default Profile;
