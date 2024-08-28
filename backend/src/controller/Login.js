const bcrypt = require("bcrypt");
const User = require("../models/User");

const {
    generateToken,
    verifyToken,
    generateRefreshToken,
} = require("../utils/authUtils");

async function login(req, res) {
    try {
        const { phoneNumber, password } = req.body;
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const token = generateToken(user);
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

async function refreshToken(req, res) {
    try {
        const { oldToken } = req.body;
        const decodedToken = verifyToken(oldToken);
        const existingUser = await User.findById(decodedToken.id);
        if (!existingUser) {
            throw new Error("User not found");
        }
        const newToken = generateRefreshToken(existingUser);
        res.json({ newToken });
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "Invalid refresh token" });
    }
}

module.exports = {
    login,
    refreshToken,
};
