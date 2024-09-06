const mongoose = require("mongoose");

const patientProgressDataSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },
    height: {
        type: Number,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    bmi: {
        type: Number,
        required: true,
    },
    bloodPressure: {
        type: Number,
        required: true,
    },
    heartRate: {
        type: Number,
        required: true,
    },
    respiratoryRate: {
        type: Number,
        required: true,
    },
    spo2: {
        // SpO2 is the percentage of oxygen in the blood
        type: Number,
        required: true,
    },
    bloodglucose: {
        type: Number,
        required: true,
    },
    CBC: {
        type: String,
        required: true,
    },
    frequencyOfUse: {
        type: String,
        required: true,
    },
    quantityOfUse: {
        type: Number,
        required: true,
    },
    numberOfCravings: {
        type: Number,
        required: true,
    },
    asiScore: {
        // Addiction Severity Index
        type: Number,
        required: true,
    },
    asiCategory: {
        // Addiction Severity Index Category
        type: String,
        required: true,
    },
    ALT: {
        type: Number,
        required: true,
    },
    AST: {
        type: Number,
        required: true,
    },
    ALP: {
        type: Number,
        required: true,
    },
    serumCreatinine: {
        type: Number,
        required: true,
    },
    urinalysis: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model(
    "PatientProgressData",
    patientProgressDataSchema
);
