// src/components/Teacher/AttendanceHistory.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

const AttendanceHistory = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [attendanceHistory, setAttendanceHistory] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const courseSnapshot = await getDocs(collection(db, 'courses'));
      setCourses(courseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      const fetchAttendance = async () => {
        const studentSnapshot = await getDocs(collection(db, `courses/${selectedCourse}/students`));
        setAttendanceHistory(studentSnapshot.docs.map(doc => doc.data()));
      };
      fetchAttendance();
    }
  }, [selectedCourse]);

  return (
    <div className="container">
      <h2>Attendance History</h2>
      <div className="form-group">
        <label>Select Course</label>
        <select
          className="form-control"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.courseName}
            </option>
          ))}
        </select>
      </div>

      {attendanceHistory.length > 0 && (
        <table className="table mt-4">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Attendance</th>
            </tr>
          </thead>
          <tbody>
            {attendanceHistory.map((history, index) => (
              <tr key={index}>
                <td>{history.name}</td>
                <td>{history.attendance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AttendanceHistory;
