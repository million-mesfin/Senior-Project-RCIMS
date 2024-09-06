const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    employmentStatus: {
        type: String,
        required: true,
    },
    educationalLevel: {
        type: String,
        required: true,
    },
    livingSituation: {
        type: String,
        enum: ["alone", "family", "shelter", "other"],
        required: true,
    },
    patientType: {
        type: String,
        enum: ["inpatient", "outpatient"],
        required: true,
    },
    roomNumber: {
        type: String,
        required: function () {
            return this.patientType === "inpatient";
        },
    },
    bedNumber: {
        type: String,
        required: function () {
            return this.patientType === "inpatient";
        },
    },
    assignedProfessionals: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Professional",
        },
    ],
    status: {
        type: String,
        enum: ["active", "discharged", "suspended"],
        required: true,
        default: "active",
    },
});

// Custom validation
patientSchema.pre("validate", function (next) {
    if (this.patientType === "outpatient") {
        this.roomNumber = undefined;
        this.bedNumber = undefined;
    }
    next();
});

module.exports = mongoose.model("Patient", patientSchema);
