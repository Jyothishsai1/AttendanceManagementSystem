// src/components/Common/Calendar.js
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import default styles
import '../../styles/Calendar.css'; // Custom styles if needed

const AttendanceCalendar = ({ attendanceData }) => {
  const [date, setDate] = useState(new Date());

  // Function to check attendance for a specific date
  const getAttendanceForDate = (date) => {
    const formattedDate = date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    const attendanceEntry = attendanceData.find(entry => entry.date === formattedDate);
    return attendanceEntry ? attendanceEntry.status : 'Absent'; // Default to 'Absent' if no entry
  };

  // Function to handle date change
  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <div>
      <Calendar
        onChange={handleDateChange}
        value={date}
      />
      <div className="attendance-status">
        <h3>Attendance Status for {date.toLocaleDateString()}</h3>
        <p>Status: {getAttendanceForDate(date)}</p>
      </div>
    </div>
  );
};

export default AttendanceCalendar;
