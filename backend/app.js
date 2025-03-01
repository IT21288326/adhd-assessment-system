const express = require("express");
const cors = require("cors"); // Import CORS
const morgan = require("morgan");
const apiRoutes = require("./src/routes/api");

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api", apiRoutes);

module.exports = app;
