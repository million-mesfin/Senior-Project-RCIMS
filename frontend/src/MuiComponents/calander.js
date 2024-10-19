import React, { useState } from 'react';
import { format, startOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// Event Data
const eventsData = [
  { date: '2024-10-03', type: 'Appointment', label: 'DR. Rick Appointment', color: 'bg-green-500' },
  { date: '2024-10-08', type: 'Meeting', label: 'Labratory Test', color: 'bg-blue-500' },
  { date: '2024-10-05', type: 'Surgery', label: 'Group Session', color: 'bg-orange-500' },
  { date: '2024-10-03', type: 'Surgery', label: 'Session With psychiatriest', color: 'bg-orange-500' },
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
          } ${isSameDay(day, selectedDate) ? 'bg-blue-200 text-black shadow' : ''}`}
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
    <div className="p-4 bg-white rounded-lg  h-full xl:w-1/2 md:w-full mb-50 mx-auto">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl text-black font-bold flex items-center">
          <span className="material-icons mr-2"><CalendarMonthIcon/></span>
          Calendar
        </h2>
        <div>
          <ArrowBackIosIcon onClick={prevMonth} />
          {/* <button className="bg-blue px-2 py-1 border border-gray-300 rounded-md" onClick={prevMonth}>
            Prev
          </button> */}
          <ArrowForwardIosIcon onClick={nextMonth} />
          {/* <button className="px-2 py-1 border border-gray-300 rounded-md ml-2" onClick={nextMonth}>
            Next
          </button> */}
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
        <h3 className="text-lg font-semibold mb-2 text-center">Activity Details</h3>
        {eventsData.map((event, index) => (
          <div key={index} className="px-10 flex items-center ">
            <div className={`w-5 h-5 rounded-full ${event.color} mr-2`}></div>
            <span>{event.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
