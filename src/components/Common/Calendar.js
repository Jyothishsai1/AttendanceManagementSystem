import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../../styles/Calendar.css'; // Custom styles if needed

const AttendanceCalendar = ({ attendanceData }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Update events whenever attendanceData changes
    const newEvents = attendanceData.map(record => ({
      title: record.status,
      start: record.date,
      allDay: true,
      color: record.status === 'Present' ? 'green' : record.status === 'Absent' ? 'red' : 'black',
    }));

    setEvents(newEvents);
  }, [attendanceData]);

  const handleDateClick = (arg) => {
    // const title = prompt('Enter Attendance Status (Present/Absent):');
    // if (title) {
    //   const newEvent = {
    //     title,
    //     start: arg.dateStr,
    //     allDay: true,
    //   };
    //   setEvents([...events, newEvent]);
    // }
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
          right: 'dayGridMonth',
        }}
      />
    </div>
  );
};

export default AttendanceCalendar;
