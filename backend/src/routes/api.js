const express = require("express");
const { processMLRequest } = require("../controllers/mlController");

const router = express.Router();

// Route to handle ML requests
router.post("/predict", processMLRequest);

module.exports = router;
