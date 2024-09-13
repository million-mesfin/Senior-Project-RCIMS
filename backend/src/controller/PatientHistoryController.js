const  PatientHistory = require ("../models/PatientHistory");

// API - Add a new patient history
const addPatientHistory = async (req, res) => {
    try {
        const { patientId, professionalId, historyData } = req.body;
        const patientHistory = await PatientHistory.create({
            patient: patientId,
            professional: professionalId,
            historyData,
        });
        const savedPatientHistory = await patientHistory.save();
        res.status(201).json({
            message: "Patient history added successfully",
            patientHistory: savedPatientHistory,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error adding patient history",
            error: error.message,
        });
    }
};

// API - Get patient history by patient ID
const getPatientHistoryByPatientId = async (req, res) => {
    try {
        const { patientId } = req.params;
        const patientHistory = await PatientHistory.find({ patient: patientId });
        res.status(200).json({
            message: "Patient history fetched successfully",
            patientHistory: patientHistory,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching patient history",
            error: error.message,
        });
    }
};

// API - Get the latest patient history
const getLatestPatientHistory = async (req, res) => {
    try {
        const { patientId } = req.params;
        const patientHistory = await PatientHistory.findOne({ patient: patientId }).sort({ createdAt: -1 });
        res.status(200).json({
            message: "Latest patient history fetched successfully",
            patientHistory,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching latest patient history",
            error: error.message,
        });
    }
};

module.exports = {
    addPatientHistory,
    getPatientHistoryByPatientId,
    getLatestPatientHistory,
};