const Patient = require("../models/Patient");
const Professional = require("../models/Professional");

// Local function - get professional from a specific department with the least number of patients
const getProfessionalWithLeastPatientsInDepartment = async (department) => {
    try {
        const professional = await Professional.findOne({
            department,
            status: "active",
        }).sort({ numberOfPatients: 1 });
        if (!professional) {
            throw new Error("Professional not found");
        }
        return professional._id;
    } catch (error) {
        console.log("Professional with the specified department not found");
        throw error;
    }
};

// Local function - Add patient to professional
const addPatientToProfessionalDefault = async (professionalId, patientId) => {
    const professional = await Professional.findById(professionalId);
    professional.patients.push(patientId);
    professional.numberOfPatients++;
    await professional.save();
};

// Local function - Remove professional from patient
const detatchProfessionalFromPatient = async (professionalId, patientId) => {
    try {
        const professional = await Professional.findById(professionalId);
        const patient = await Patient.findById(patientId);

        if (!professional || !patient) {
            throw new Error('Professional or Patient not found');
        }

        professional.patients.pull(patient.user);
        professional.numberOfPatients = Math.max(0, professional.numberOfPatients - 1);

        await professional.save();

        patient.assignedProfessionals.pull(professionalId);

        await patient.save();

        return { success: true };
    } catch (error) {
        console.error('Error in detachProfessionalFromPatient:', error);
        throw error;
    }
};

// Local function - remove patient from professional
//! Only development purpose
const removePatient = async (patientId) => {
    const professionals = await Professional.find({ patients: patientId });
    for (const professional of professionals) {
        professional.patients.pull(patientId);
        professional.numberOfPatients--;
        await professional.save();
    }
};

module.exports = {
    getProfessionalWithLeastPatientsInDepartment,
    addPatientToProfessionalDefault,
    removePatient,
    detatchProfessionalFromPatient
};
