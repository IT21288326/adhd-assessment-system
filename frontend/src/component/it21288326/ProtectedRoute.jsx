import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';


const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
        try {
          const response = await axios.get('http://localhost:8800/api/child/profile', {
            withCredentials: true,
          });
          setIsAuthenticated(true); // Authentication is successful
        } catch (error) {
          setIsAuthenticated(false); // Authentication failed
        }
      };
      

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Or a spinner
  }

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
