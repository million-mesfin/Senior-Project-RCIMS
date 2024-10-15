import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfessionalStyles/Schedule.css"; // Custom CSS for the grid

const Schedule = () => {
    const [schedule, setSchedule] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Time slots for the schedule (2-hour intervals)
    const timeSlots = [
        "08:00 AM - 10:00 AM", 
        "10:00 AM - 12:00 PM", 
        "12:00 PM - 01:00 PM (Lunch Break)",
        "01:00 PM - 03:00 PM", 
        "03:00 PM - 05:00 PM", 
    ];

    // Days of the week
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    const fetchSchedule = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user")); 

            if (!user || !user._id) {
                throw new Error("No user found in local storage.");
            }

            console.log("Fetched User ID from LocalStorage:", user._id);

            const response = await axios.get(`http://localhost:5000/api/schedule/schedule/${user._id}`);

            if (!response.data.schedule) {
                throw new Error("No schedule found for this user.");
            }

            setSchedule(response.data.schedule); 
        } catch (err) {
            setError(
                "Error fetching schedule: " +
                    (err.response?.data?.message || err.message)
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedule(); 
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    // Helper function to display sessions based on time slot and day
    const getSessionForTimeSlot = (time, dayIndex, weekType) => {
        const sessionsForDay = schedule[weekType].filter((session) => {
            const sessionDay = new Date(session.date).getDay();
            return sessionDay === dayIndex; // 0 = Sunday, 1 = Monday, etc.
        });

        return sessionsForDay.find((session) => {
            const sessionStartTime = sessionStartTimeMap[session.sessionNumber]; 
            return sessionStartTime === time;
        });
    };

    // Mapping session numbers to time slots (each session lasts 2 hours)
    const sessionStartTimeMap = {
        1: "08:00 AM - 10:00 AM",
        2: "10:00 AM - 12:00 PM",
        3: "12:00 PM - 01:00 PM (Lunch Break)",
        4: "01:00 PM - 03:00 PM",
        5: "03:00 PM - 05:00 PM"
    };

    return (
        <div className="schedule-container">
            {/* Current Week's Schedule */}
            <h2>Current Week's Schedule</h2>
            <div className="schedule-grid">
                {/* Days of the week headers */}
                <div className="schedule-header"></div> {/* Empty cell for time column */}
                {daysOfWeek.map((day) => (
                    <div key={day} className="schedule-header">
                        {day}
                    </div>
                ))}

                {/* Time slots and session rendering */}
                {timeSlots.map((time) => (
                    <>
                        {/* Time slot column */}
                        <div key={time} className="time-slot">
                            {time}
                        </div>

                        {/* Days columns */}
                        {daysOfWeek.map((_, dayIndex) => {
                            const session = getSessionForTimeSlot(time, dayIndex + 1, 'currentWeek'); // Current week sessions

                            return (
                                <div key={`${time}-${dayIndex}`} className="session-cell">
                                    {session ? (
                                        <div>
                                            <p>Session {session.sessionNumber}</p>
                                            <p>Status: {session.status}</p>
                                        </div>
                                    ) : (
                                        <p>--</p> 
                                    )}
                                </div>
                            );
                        })}
                    </>
                ))}
            </div>

            {/* Next Week's Schedule */}
            <h2>Next Week's Schedule</h2>
            <div className="schedule-grid">
                {/* Days of the week headers */}
                <div className="schedule-header"></div> {/* Empty cell for time column */}
                {daysOfWeek.map((day) => (
                    <div key={day} className="schedule-header">
                        {day}
                    </div>
                ))}

                {/* Time slots and session rendering */}
                {timeSlots.map((time) => (
                    <>
                        {/* Time slot column */}
                        <div key={time} className="time-slot">
                            {time}
                        </div>

                        {/* Days columns */}
                        {daysOfWeek.map((_, dayIndex) => {
                            const session = getSessionForTimeSlot(time, dayIndex + 1, 'nextWeek'); // Next week sessions

                            return (
                                <div key={`${time}-${dayIndex}`} className="session-cell">
                                    {session ? (
                                        <div>
                                            <p>Session {session.sessionNumber}</p>
                                            <p>Status: {session.status}</p>
                                        </div>
                                    ) : (
                                        <p>--</p> // Default text for working hours without specific sessions
                                    )}
                                </div>
                            );
                        })}
                    </>
                ))}
            </div>
        </div>
    );
};

export default Schedule;
