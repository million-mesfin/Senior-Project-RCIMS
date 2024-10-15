const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Professional = require("../models/Professional");
const Schedule = require("../models/Schedule");
const User = require("../models/User");

//* API - get matching available isolated sessions - pass professional and patient ID
const getCommonAvailableSessions = async (req, res) => {
    try {
        const { professionalId, patientId } = req.params;
        const professional = await Professional.findById(professionalId);
        const patient = await Patient.findById(patientId);
        if (!professional || !patient) {
            return res.status(404).json({
                message: "Professional or patient not found",
            });
        }

        const professionalSchedule = await Schedule.findOne({
            userId: professional.user,
        });
        const patientSchedule = await Schedule.findOne({
            userId: patient.user,
        });

        if (!professionalSchedule || !patientSchedule) {
            return res.status(404).json({
                message: "Schedule not found",
            });
        }

        const commonAvailableSessionsCurrentWeek =
            professionalSchedule.currentWeek
                .filter((profSession) => profSession.status === "available")
                .map((profSession) => {
                    const matchingPatientSession =
                        patientSchedule.currentWeek.find(
                            (patientSession) =>
                                patientSession.sessionNumber ===
                                    profSession.sessionNumber &&
                                patientSession.type === profSession.type &&
                                patientSession.status === "available"
                        );
                    return matchingPatientSession
                        ? {
                              professional: profSession,
                              patient: matchingPatientSession,
                          }
                        : null;
                })
                .filter(Boolean);

        const commonAvailableSessionsNextWeek = professionalSchedule.nextWeek
            .filter((profSession) => profSession.status === "available")
            .map((profSession) => {
                const matchingPatientSession = patientSchedule.nextWeek.find(
                    (patientSession) =>
                        patientSession.sessionNumber ===
                            profSession.sessionNumber &&
                        patientSession.type === profSession.type &&
                        patientSession.status === "available"
                );
                return matchingPatientSession
                    ? {
                          professional: profSession,
                          patient: matchingPatientSession,
                      }
                    : null;
            })
            .filter(Boolean);

        res.status(200).json({
            message: "Common available sessions retrieved successfully",
            commonAvailableSessionsCurrentWeek,
            commonAvailableSessionsNextWeek,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving common available sessions",
            error: error.message,
        });
    }
};

//* API - Add a isolated appointment
const addIsolatedAppointment = async (req, res) => {
    try {
        const {
            patientSessionId,
            professionalSessionId,
            patientId,
            professionalId,
        } = req.body;

        const professional = await Professional.findById(professionalId);
        const patient = await Patient.findById(patientId);

        const professionalSchedule = await Schedule.findOne({
            userId: professional.user,
        });
        const patientSchedule = await Schedule.findOne({
            userId: patient.user,
        });

        if (!professionalSchedule || !patientSchedule) {
            return res.status(404).json({
                message: "Schedule not found",
            });
        }

        // Find patient session in current week
        const patientSession = patientSchedule.currentWeek.find(
            (session) => session._id.toString() === patientSessionId
        );
        if (!patientSession) {
            // Find session in next week
            patientSession = patientSchedule.nextWeek.find(
                (session) => session._id.toString() === patientSessionId
            );
            if (!patientSession) {
                return res
                    .status(404)
                    .json({ message: "Patient session not found" });
            }
        }

        // Find professional session in current week
        const professionalSession = professionalSchedule.currentWeek.find(
            (session) => session._id.toString() === professionalSessionId
        );
        if (!professionalSession) {
            // Find session in next week
            professionalSession = professionalSchedule.nextWeek.find(
                (session) => session._id.toString() === professionalSessionId
            );
            if (!professionalSession) {
                return res
                    .status(404)
                    .json({ message: "Professional session not found" });
            }
        }

        const sessionDate = patientSession.date;
        const sessionType = patientSession.type;

        // update the status of the sessions
        patientSession.status = "booked";
        professionalSession.status = "booked";

        // Save the parent documents
        await patientSchedule.save();
        await professionalSchedule.save();

        // Increment the number of appointments for the professional
        professional.numberOfAppointments += 1;
        await professional.save();

        const sessionNumber = patientSession.sessionNumber;
        let startTime;
        switch (sessionNumber) {
            case 1:
                startTime = new Date(patientSession.date.setHours(9, 0, 0, 0));
                break;
            case 2:
                startTime = new Date(patientSession.date.setHours(10, 0, 0, 0));
                break;
            case 3:
                startTime = new Date(patientSession.date.setHours(11, 0, 0, 0));
                break;
            case 4:
                startTime = new Date(patientSession.date.setHours(12, 0, 0, 0));
                break;
            case 5:
                startTime = new Date(patientSession.date.setHours(13, 0, 0, 0));
                break;
            case 6:
                startTime = new Date(patientSession.date.setHours(16, 0, 0, 0));
                break;
            case 7:
                startTime = new Date(patientSession.date.setHours(17, 0, 0, 0));
                break;
            case 8:
                startTime = new Date(patientSession.date.setHours(18, 0, 0, 0));
                break;
            default:
                res.status(400).json({ message: "Invalid session number" });
        }
        const newAppointment = await Appointment.create({
            type: sessionType,
            patientId,
            patientSession: [patientSession._id],
            professionalSession: [professionalSession._id],
            professionalId,
            sessionNumber: sessionNumber,
            startTime,
            date: sessionDate,
        });

        const savedAppointment = await newAppointment.save();

        res.status(201).json({
            message: "Appointment added successfully",
            appointment: savedAppointment,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error adding appointment",
            error: error.message,
        });
    }
};

//* API - get all appointments for a user
const getAllAppointmentsForUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const professional = await Professional.findOne({ user: userId });
        const appointments = await Appointment.find({
            professionalId: professional._id,
        });
        res.status(200).json({ appointments });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching appointments",
            error: error.message,
        });
    }
};

//* API - get appointment details
const getAppointmentDetails = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        const patient = await Patient.findById(appointment.patientId);
        const professional = await Professional.findById(
            appointment.professionalId
        );
        const patientUser = await User.findById(patient.user);
        const patientName =
            patientUser.name +
            " " +
            patientUser.fatherName +
            " " +
            patientUser.grandfatherName;
        const patientType = patient.patientType;
        const professionalUser = await User.findById(professional.user);
        const professionalName =
            professionalUser.name +
            " " +
            professionalUser.fatherName +
            " " +
            professionalUser.grandfatherName;


        res.status(200).json({
            appointment,
            patientType,
            patientName,
            professionalName
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching appointment details",
            error: error.message,
        });
    }
};

module.exports = {
    getCommonAvailableSessions,
    addIsolatedAppointment, // Use this endpoint for professionals with type isolated
    getAllAppointmentsForUser,
    getAppointmentDetails,
};
