const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    idNumber: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: { type: String },
    course: { type: String, required: true },
    year: { type: Number, required: true }
});

module.exports = mongoose.model("Student", studentSchema);