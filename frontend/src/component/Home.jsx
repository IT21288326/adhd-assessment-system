
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Home = () => {
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

    <div className="home" style={{ backgroundColor: "lightblue" }}>
  <div style={{ textAlign: 'center' }}>
    <h1 style={{ fontSize: '80px', fontWeight: 'bold', marginTop: '30px' }}>Welcome {child.name} !!</h1>

    <div className="row" style={{ height: '60%', marginTop: '60px', display: 'flex', justifyContent: 'center' }}>
      <div className="col-sm-4" style={{ display: 'flex', justifyContent: 'center' }}>
        <div
          className="card"
          style={{
            boxShadow: '10px 14px 18px rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
            opacity: '0.88',
            width: '80%',
            height: '100%',
            borderRadius: '60px',
          }}
        >
          <div className="card-body" style={{ textAlign: 'center' }}>
            <Link to="/profile" state={{ childId: child._id }} className="link-style">
              <p style={{ fontSize: '40px', fontWeight: 'bold' }}>ADHD Assessment</p>
              <img
                src="/assets/it21288326/assess.jpg"
                alt="Image description"
                style={{ width: '70%', height: '65%', marginTop: '20px', borderRadius: '40px', cursor: 'pointer' }}
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
            height: '100%',
            borderRadius: '60px',
          }}
        >
          <div className="card-body" style={{ textAlign: 'center' }}>
            <Link to="/questionnaire-form" state={{ childId: child._id }} className="link-style">
              <p style={{ fontSize: '40px', fontWeight: 'bold' }}>Focus Development</p>
              <img
                src="/assets/it21288326/focus.jpg"
                alt="Image description"
                style={{ width: '70%', height: '65%', marginTop: '20px', borderRadius: '10px', cursor: 'pointer' }}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>

    
    <div className="row" style={{ height: '60%', marginTop: '80px', display: 'flex', justifyContent: 'center',marginBottom:'60px' }}>
      <div className="col-sm-4" style={{ display: 'flex', justifyContent: 'center' }}>
        <div
          className="card"
          style={{
            boxShadow: '10px 14px 18px rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
            opacity: '0.88',
            width: '80%',
            height: '100%',
            borderRadius: '60px',
          }}
        >
          <div className="card-body" style={{ textAlign: 'center' }}>
            <Link to="/reaction-time-game" state={{ childId: child._id }} className="link-style">
              <p style={{ fontSize: '40px', fontWeight: 'bold' }}>Impulse Control</p>
              <img
                src="/assets/it21288326/impulse.jpg"
                alt="Image description"
                style={{ width: '70%', height: '65%', marginTop: '20px', borderRadius: '40px', cursor: 'pointer' }}
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
            height: '100%',
            borderRadius: '60px',
          }}
        >
          <div className="card-body" style={{ textAlign: 'center' }}>
            <Link to="/questionnaire-form" state={{ childId: child._id }} className="link-style">
              <p style={{ fontSize: '40px', fontWeight: 'bold' }}>Summary Reports</p>
              <img
                src="/assets/it21288326/report.jpg"
                alt="Image description"
                style={{ width: '70%', height: '65%', marginTop: '20px', borderRadius: '10px', cursor: 'pointer' }}
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

export default Home;
