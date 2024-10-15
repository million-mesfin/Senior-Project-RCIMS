// import React, { useState } from "react";
// import { Box, Typography, Button, Badge, IconButton } from "@mui/material";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import AddIcon from "@mui/icons-material/Add";
// import CircleIcon from "@mui/icons-material/Circle";
// import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { format } from "date-fns";

// const eventsData = [
//   { date: '2022-06-10', type: 'Appointment', label: 'DR. Rick Appointment', color: 'green' },
//   { date: '2022-06-10', type: 'Meeting', label: 'Dentist Meetup', color: 'blue' },
//   { date: '2022-06-10', type: 'Surgery', label: 'Jhon Surgery', color: 'orange' },
// ];

// const ReusableCalendar = () => {
//   const [selectedDate, setSelectedDate] = useState(new Date());

//   const renderEventDots = (day) => {
//     const formattedDay = format(day, "yyyy-MM-dd");
//     const events = eventsData.filter(event => event.date === formattedDay);

//     return (
//       <Box display="flex" justifyContent="center">
//         {events.map((event, index) => (
//           <Badge
//             key={index}
//             overlap="circular"
//             badgeContent={<CircleIcon sx={{ color: event.color, fontSize: "small" }} />}
//           />
//         ))}
//       </Box>
//     );
//   };

//   return (
//     <Box sx={{ p: 2, borderRadius: 4, boxShadow: 3, minWidth: 600 }}>
//       <Box display="flex" alignItems="center" justifyContent="space-between">
//         <Box display="flex" alignItems="center">
//           <CalendarMonthIcon sx={{ mr: 1 }} />
//           <Typography variant="h6" fontWeight="bold">Calendar</Typography>
//         </Box>
//         <Button variant="outlined" startIcon={<AddIcon />}>
//           Add new
//         </Button>
//       </Box>

//       <LocalizationProvider dateAdapter={AdapterDateFns}>
//         <StaticDatePicker
//           displayStaticWrapperAs="desktop"
//           value={selectedDate}
//           onChange={(newDate) => setSelectedDate(newDate)}
//           renderDay={(day, _value, DayComponentProps) => (
//             <Box {...DayComponentProps} sx={{ position: "relative" }}>
//               {DayComponentProps.children}
//               {renderEventDots(day)}
//             </Box>
//           )}
//         />
//       </LocalizationProvider>

//       <Box mt={2}>
//         <Typography variant="body2" fontWeight="bold">
//           Activity Details
//         </Typography>
//         {eventsData.map((event, index) => (
//           <Box key={index} display="flex" alignItems="center" mb={1}>
//             <CircleIcon sx={{ color: event.color, fontSize: 14, mr: 1 }} />
//             <Typography variant="body2">{event.label}</Typography>
//           </Box>
//         ))}
//       </Box>
//     </Box>
//   );
// };

// export default ReusableCalendar;


import React, { useState } from 'react';
import { format, startOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';

// Event Data
const eventsData = [
  { date: '2022-06-10', type: 'Appointment', label: 'DR. Rick Appointment', color: 'bg-green-500' },
  { date: '2022-06-10', type: 'Meeting', label: 'Dentist Meetup', color: 'bg-blue-500' },
  { date: '2022-06-10', type: 'Surgery', label: 'Jhon Surgery', color: 'bg-orange-500' },
];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Render days in the calendar
  const renderDays = () => {
    const startMonth = startOfMonth(currentDate);
    const startDate = startOfWeek(startMonth);
    const days = [];

    let day = startDate;
    let formattedDate = '';
    for (let i = 0; i < 42; i++) {
      formattedDate = format(day, 'd');
      const cloneDay = day;

      days.push(
        <div
          key={day}
          className={`p-2 cursor-pointer text-center ${
            !isSameMonth(day, startMonth) ? 'text-gray-400' : ''
          } ${isSameDay(day, selectedDate) ? 'bg-blue-500 text-white rounded-full' : ''}`}
          onClick={() => setSelectedDate(cloneDay)}
        >
          <span>{formattedDate}</span>
          <div className="flex justify-center mt-1">
            {renderEventDots(day)}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }

    return days;
  };

  // Render event dots under dates
  const renderEventDots = (day) => {
    const formattedDay = format(day, 'yyyy-MM-dd');
    const events = eventsData.filter(event => event.date === formattedDay);

    return events.map((event, index) => (
      <div key={index} className={`w-2 h-2 rounded-full ${event.color} mx-0.5`}></div>
    ));
  };

  // Go to previous month
  const prevMonth = () => {
    setCurrentDate(addDays(currentDate, -30));
  };

  // Go to next month
  const nextMonth = () => {
    setCurrentDate(addDays(currentDate, 30));
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <span className="material-icons mr-2">calendar_today</span>
          Calendar
        </h2>
        <div>
          <button className="px-2 py-1 border border-gray-300 rounded-md" onClick={prevMonth}>
            Prev
          </button>
          <button className="px-2 py-1 border border-gray-300 rounded-md ml-2" onClick={nextMonth}>
            Next
          </button>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="grid grid-cols-7 text-center text-gray-500 font-medium">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Calendar Body */}
      <div className="grid grid-cols-7 mt-2 gap-y-2">
        {renderDays()}
      </div>

      {/* Activity Details */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Activity Details</h3>
        {eventsData.map((event, index) => (
          <div key={index} className="flex items-center mb-1">
            <div className={`w-3 h-3 rounded-full ${event.color} mr-2`}></div>
            <span>{event.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
