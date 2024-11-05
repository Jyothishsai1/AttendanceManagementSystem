// src/components/Common/FullCalendar.js
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import '@fullcalendar/common/main.css';
import '@fullcalendar/daygrid/main.css';
import '../../styles/Calendar.css'; // Custom styles if needed

const AttendanceCalendar = ({ attendanceData }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const formattedEvents = attendanceData.map(entry => ({
      title: entry.status,
      date: entry.date,
      className: entry.status === 'Present' ? 'success' : 'important', // You can add more classes for different statuses
    }));
    setEvents(formattedEvents);
  }, [attendanceData]);

  const handleDateClick = (arg) => {
    alert(`Date: ${arg.dateStr}`);
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay'
        }}
        editable={true}
      />
    </div>
  );
};

export default AttendanceCalendar;
