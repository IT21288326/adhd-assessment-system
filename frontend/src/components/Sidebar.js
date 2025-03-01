import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="d-flex flex-column bg-primary text-white vh-100 p-3" style={{ width: "250px" }}>
      <div className="mb-4">
        <img
          src="https://via.placeholder.com/80"
          alt="User Profile"
          className="rounded-circle"
          width="80"
          height="80"
        />
        <h5 className="mt-3">Welcome Back!</h5>
      </div>
      <nav className="nav flex-column">
        <Link to="/" className="nav-link text-white">Dashboard</Link>
        <Link to="/form" className="nav-link text-white">Form</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
