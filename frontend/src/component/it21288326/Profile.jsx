
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

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
    <div>
      <h1>Welcome to Your Profile, {child.name}</h1>
      <p>Age: {child.age}</p>
      <p>Gender: {child.gender}</p>

      <nav>
        <ul>
          <li>
            <Link to="/reaction-time-game" state={{ childId: child._id }}>
              Reaction Time Game
            </Link>
          </li>
          <li>
            <Link to="/questionnaire-form" state={{ childId: child._id }}>
              Questionnaire Form
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Profile;
