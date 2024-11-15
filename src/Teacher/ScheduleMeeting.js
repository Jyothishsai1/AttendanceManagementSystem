// src/components/Teacher/ScheduleMeeting.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import SchedulePNG from '../assets/schedule.png';

const ScheduleMeeting = () => {
  const [courses, setCourses] = useState([]);
  const [meetingInfo, setMeetingInfo] = useState({
    courseId: '',
    meetingLink: '',
    meetingDetails: '',
    meetingDate: '',
  });
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      const coursesRef = collection(db, 'courses');
      const courseSnapshot = await getDocs(coursesRef);
      const teacherCourses = courseSnapshot.docs
        .filter((doc) => doc.data().createdBy === currentUser.email)
        .map((doc) => ({ id: doc.id, ...doc.data() }));
      setCourses(teacherCourses);
    };
    fetchCourses();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'meetings'), {
      ...meetingInfo,
      teacherId: currentUser.uid,
      createdAt: new Date(),
    });
    setMeetingInfo({
      courseId: '',
      meetingLink: '',
      meetingDetails: '',
      meetingDate: '',
    });
  };

  return (
    <div className="container">
      <h2 className="text-center m-5">Schedule Meeting</h2>
      <div className='row'>
      <div className='col-8 '>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor='course'>Select Course</label>
          <select
            id='course'
            className="form-control"
            value={meetingInfo.courseId}
            onChange={(e) => setMeetingInfo({ ...meetingInfo, courseId: e.target.value })}
            required
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.courseName}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor='link'>Meeting Link</label>
          <input
            id='link'
            type="url"
            className="form-control"
            value={meetingInfo.meetingLink}
            onChange={(e) => setMeetingInfo({ ...meetingInfo, meetingLink: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor='details'>Meeting Details</label>
          <textarea
            id='details'
            className="form-control"
            value={meetingInfo.meetingDetails}
            onChange={(e) => setMeetingInfo({ ...meetingInfo, meetingDetails: e.target.value })}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor='date'>Meeting Date</label>
          <input
            id='date'
            type="date"
            className="form-control"
            value={meetingInfo.meetingDate}
            onChange={(e) => setMeetingInfo({ ...meetingInfo, meetingDate: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
        <button type="submit" className="btn btn-primary mt-3">
          Schedule Meeting
        </button>
        </div>
      </form>
      </div>
      <div className='col-4'>
      <img className="CourseImage" src={SchedulePNG} alt="Schedule Image" />
      </div>
      </div>
    </div>
    
  );
};

export default ScheduleMeeting;
