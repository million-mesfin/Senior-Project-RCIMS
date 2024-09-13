const express = require("express");

const router = express.Router();

const {
    addPatientHistory,
    getPatientHistoryByPatientId,
    getLatestPatientHistory,
} = require("../controller/PatientHistoryController");


router.post("/add-patient-history", addPatientHistory);
router.get("/get-patient-history/:patientId", getPatientHistoryByPatientId);
router.get("/get-latest-patient-history/:patientId", getLatestPatientHistory);

module.exports = router;


