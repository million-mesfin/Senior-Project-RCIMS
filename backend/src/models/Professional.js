const mongoose = require("../configuration/dbConfig");

const professionalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    // Add professional details
    // Professional is extended from User schema
    qualification: {
        type: String,
        required: true,
    },
    speciality: {
        type: String,
        required: true,
    },
    licenseNumber: {
        type: String,
        required: true,
    },
    yearsOfExperience: {
        type: Number,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        required: true,
    },
    languagesSpoken: {
        type: [String],
        required: true,
    },
    workingHours: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["active", "suspended", "terminated"], //! removed inactive
        default: "active",
    },
    //! Add professional photo
});

module.exports = mongoose.model("Professional", professionalSchema);
