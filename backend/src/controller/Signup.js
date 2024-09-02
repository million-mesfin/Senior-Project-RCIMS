const User = require("../models/User");
const bcrypt = require("bcrypt");

// Add a new user
async function signupUser(req, res) {
    try {
        const {
            name,
            fatherName,
            grandfatherName,
            phoneNumber,
            password,
            role,
            dateOfBirth,
            gender,
            address,
        } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            fatherName,
            grandfatherName,
            phoneNumber,
            password: hashedPassword,
            role,
            dateOfBirth,
            gender,
            address,
        });

        const savedUser = await newUser.save();
        // res.status(201).json({
        //     message: "User created successfully",
        //     user: savedUser,
        // });
        return savedUser;
    } catch (error) {
        console.log(error);
        console.log("Internal server error");
        res.status(400).json({
            error: "Unable to create user. Please try again later.",
        });
    }
}

module.exports = { signupUser };
