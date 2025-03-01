const mongoose = require("mongoose");

const InputDataSchema = new mongoose.Schema({
    input: { type: Object, required: true },
    mlResponse: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("InputData", InputDataSchema);
