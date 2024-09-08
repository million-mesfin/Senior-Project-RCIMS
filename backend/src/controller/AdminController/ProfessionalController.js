const User = require("../../models/User");
const Professional = require("../../models/Professional");
const { signupUser } = require("../Signup");

const addProfessional = async (req, res) => {
    try {
        
        const user = await signupUser(req, res);

        if (!user) {
            // console.error('User object is null or undefined');
            return res.status(400).json({ error: "Failed to create user" });
            return;
        }

        if (!user._id) {
            // console.error('User created but _id is missing:', user);
            return res.status(400).json({ error: "User created but _id is missing" });
            return;
        }

        const {
            qualification,
            speciality,
            licenseNumber,
            yearsOfExperience,
            department,
            bio,
            languagesSpoken,
            workingHours,
        } = req.body;

        const newProfessional = new Professional({
            user: user._id,
            qualification,
            speciality,
            licenseNumber,
            yearsOfExperience,
            department,
            bio,
            languagesSpoken,
            workingHours,
        });

        const savedProfessional = await newProfessional.save();

        res.status(201).json({ message: 'Professional added successfully', professional: savedProfessional });
    } catch (error) {
        console.error('Error in addProfessional:', error);
        res.status(500).json({ message: 'Error adding professional', error: error.message });
    }
};

const getProfessionals = async (req, res) => {
    try {
        const professionals = await Professional.find().populate('user', '-password');
        res.status(200).json({ professionals });
    } catch (error) {
        console.error('Error in getProfessionals:', error);
        res.status(500).json({ message: 'Error getting professionals', error: error.message });
    }
};

const getProfessionalById = async (req, res) => {
    try {
        const { id } = req.params;
        const professional = await Professional.findById(id).populate('user', '-password');
        if (!professional) {
            return res.status(404).json({ message: 'Professional not found' });
        }
        res.status(200).json({ professional });
    } catch (error) {
        console.error('Error in getProfessionalById:', error);
        res.status(500).json({ message: 'Error getting professional by id', error: error.message });
    }
};


const updateProfessional = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            // Professional fields
            qualification,
            speciality,
            licenseNumber,
            yearsOfExperience,
            department,
            bio,
            languagesSpoken,
            workingHours,
            status,
            // User fields
            name,
            fatherName,
            grandfatherName,
            phoneNumber,
            dateOfBirth,
            gender,
            address
        } = req.body;

        // Update Professional
        const updatedProfessional = await Professional.findByIdAndUpdate(
            id,
            { qualification, speciality, licenseNumber, yearsOfExperience, department, bio, languagesSpoken, workingHours, status },
            { new: true }
        );

        if (!updatedProfessional) {
            return res.status(404).json({ message: 'Professional not found' });
        }

        // Update related User
        const updatedUser = await User.findByIdAndUpdate(
            updatedProfessional.user,
            { name, fatherName, grandfatherName, phoneNumber, dateOfBirth, gender, address },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'Related user not found' });
        }

        res.status(200).json({
            message: 'Professional and related user updated successfully',
            professional: updatedProfessional,
            user: updatedUser
        });
    } catch (error) {
        console.error('Error in updateProfessional:', error);
        res.status(500).json({ message: 'Error updating professional', error: error.message });
    }
};

const deleteProfessional = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find the professional
        const professional = await Professional.findById(id);
        if (!professional) {
            return res.status(404).json({ message: 'Professional not found' });
        }

        // Delete the professional
        await Professional.findByIdAndDelete(id);

        // Delete the related user
        await User.findByIdAndDelete(professional.user);

        res.status(200).json({ message: 'Professional and related user deleted successfully' });
    } catch (error) {
        console.error('Error in deleteProfessional:', error);
        res.status(500).json({ message: 'Error deleting professional', error: error.message });
    }
};

const checkPhoneNumber = async (req, res) => {
    try {
        const { phoneNumber } = req.params;
        const existingUser = await User.findOne({ phoneNumber });
        res.json({ exists: !!existingUser });
    } catch (error) {
        console.error('Error in checkPhoneNumber:', error);
        res.status(500).json({ message: 'Error checking phone number', error: error.message });
    }
};

module.exports = {
    addProfessional,
    getProfessionals,
    updateProfessional,
    deleteProfessional,
    getProfessionalById,
    checkPhoneNumber,
};
