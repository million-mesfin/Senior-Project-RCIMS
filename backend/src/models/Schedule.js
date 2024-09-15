const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    currentWeek: [
        {
            date: {
                type: Date,
                required: true,
            },
            sessionNumber: {
                type: Number,
                required: true,
            },
            status: {
                type: String,
                required: true,
                enum: ["available", "booked", "unavailable"],
            },
        }
    ],

    nextWeek: [
        {
            date: {
                type: Date,
                required: true,
            },
            sessionNumber: {
                type: Number,
                required: true,
            },
            status: {
                type: String,
                required: true,
                enum: ["available", "booked", "unavailable"],
            },
        }
    ]
});

module.exports = mongoose.model("Schedule", scheduleSchema);