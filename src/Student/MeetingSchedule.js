// src/components/Student/MeetingSchedule.js
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { db } from '../firebase/config'; // Adjust the import path
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext'; // Assuming you have an AuthContext for user data
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import { Modal } from 'react-bootstrap'; // Import Modal from react-bootstrap

const MeetingSchedule = () => {
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const { currentUser } = useAuth(); // Get current user from context

  useEffect(() => {
    const fetchMeetings = async () => {
      const meetingData = [];
      const studentSnapshot = await getDocs(collection(db, 'users'));
      const studentDoc = studentSnapshot.docs.find(doc => doc.data().email.toLowerCase() === currentUser.email);

      if (studentDoc) {
        const studentData = studentDoc.data();
        const enrolledCourses = studentData.enrolledCourses || [];

        // Fetch meetings for each enrolled course
        for (const courseId of enrolledCourses) {
          const meetingsSnapshot = await getDocs(collection(db, 'meetings'));

          for (const meetingDoc of meetingsSnapshot.docs) {
            const meeting = meetingDoc.data();

            // Check if the meeting belongs to the current courseId
            if (meeting.courseId === courseId) {
              const courseDoc = await getDocs(collection(db, 'courses')).then(snapshot => {
                return snapshot.docs.find(doc => doc.id === meeting.courseId);
              });

              if (courseDoc) {
                const courseData = courseDoc.data();
                meetingData.push({
                  title: courseData.courseName,
                  start: meeting.meetingDate,
                  details: meeting.meetingDetails,
                  url: meeting.meetingLink,
                });
              }
            }
          }
        }
      }

      setMeetings(meetingData);
    };

    fetchMeetings();
  }, [currentUser.email]);

  const handleMeetingClick = (event) => {
    const meeting = meetings.find(m => m.title === event.event.title);
    // if (meeting) {
    //   setSelectedMeeting(meeting);
    // }
  };

  const handleCloseModal = () => {
    setSelectedMeeting(null);
  };

  return (
    <div class='m-5'>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={meetings}
        eventClick={handleMeetingClick} // Open modal on title click
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth',
        }}
        height="600px"
        eventContent={(eventInfo) => (
          <div style={{ cursor: 'pointer' }}>
            <strong>{eventInfo.event.title}</strong>
          </div>
        )}
      />

      <Modal show={!!selectedMeeting} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedMeeting?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{selectedMeeting?.details}</p>
        </Modal.Body>
        <Modal.Footer>
          <a 
            href={selectedMeeting?.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-primary"
          >
            Join Meeting
          </a>
          <button className="btn btn-secondary" onClick={handleCloseModal}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MeetingSchedule;
