const express = require("express");

const router = express.Router();

const {
    getCommonAvailableSessions,
    addIsolatedAppointment,
    getAllAppointmentsForUser,
    getAppointmentDetails,
    cancelAppointment,
} = require("../controller/AppointmentController");

router.post("/add-isolated-appointment", addIsolatedAppointment);
router.get("/common-sessions/:professionalId/:patientId", getCommonAvailableSessions);
router.get("/user-appointments/:userId", getAllAppointmentsForUser);
router.get("/appointment-details/:appointmentId", getAppointmentDetails);
router.delete("/cancel-appointment/:appointmentId", cancelAppointment);
module.exports = router;

