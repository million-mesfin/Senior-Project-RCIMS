const mongoose = require("mongoose");

const patientInitialHistorySchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },
    currentMedicalConditions: {
        type: [String],
        required: true,
    },
    primarySubstance: {
        type: String,
        required: true,
    },
    primarySubstanceMethodOfUse: {
        type: [String],
        enum: ["oral", "injection", "inhalation", "other"],
        required: true,
    },
    secondarySubstances: {
        type: [String],
        default: [],
    },
    pastAddictionTreatment: {
        type: Boolean,
        required: true,
    },
    withdrawalSymptoms: {
        type: Boolean,
        required: true,
    },
    socialSupportNetwork: {
        type: [String],
        enum: ["family", "friend", "support group", "other"],
        required: true,
    },
    allergies: {
        type: [String],
        default: [],
    },
    historyOfTraumaOrAbuse: {
        type: Boolean,
        required: true,
    },
});

module.exports = mongoose.model("PatientInitialHistory", patientInitialHistorySchema);
